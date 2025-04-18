import { BaseService } from '@/core/abstracts/base.service';
import { IMentorRepository } from '@/core/interfaces/repositories/IMentorRepository';
import { IUserRepository } from '@/core/interfaces/repositories/IUserRepository';
import { IMentorService } from '@/core/interfaces/services/IMentorService';
import { MentorStatus, PersonalInfo } from '@/core/types';
import { TYPES } from '@/di/types';
import { IMentor } from '@/models/mentor.model';
import CustomError from '@/utils/CustomError';
import { inject, injectable } from 'inversify';

@injectable()
export class MentorService extends BaseService<IMentor> implements IMentorService {
  constructor(
    @inject(TYPES.MentorRepository) private mentorRepository: IMentorRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {
    super(mentorRepository);
  }

  applyAsMentor = async (
    userId: string,
    data: {
      personalInfo: PersonalInfo;
      experience: IMentor['experience'];
      mentorshipDetails: IMentor['mentorshipDetails'];
    }
  ): Promise<IMentor> => {
    const existingMentor = await this.mentorRepository.findMentorByUserId(userId);
    if (existingMentor) {
      throw new CustomError('You have already applied to be a mentor.');
    }

    const { personalInfo, experience, mentorshipDetails } = data;

    const updatedUser = await this.userRepository.updateUser(userId, {
      ...personalInfo,
      profilePic: personalInfo.profilePic as string,
    });

    console.log(userId, updatedUser);

    if (!updatedUser) {
      throw new CustomError('User not found.');
    } else {
      const mentor = await this.mentorRepository.createMentorApplication(userId, {
        experience,
        mentorshipDetails,
      });

      return mentor;
    }
  };

  approveMentor = async (mentorId: string, userId: string): Promise<IMentor> => {
    const mentor = await this.mentorRepository.updateMentorStatus(mentorId, 'approved');
    if (!mentor) {
      throw new CustomError('Mentor application not found.');
    }

    // Update user role to 'mentor'
    const updatedUser = await this.userRepository.updateUser(userId, { role: 'mentor' });
    if (!updatedUser) {
      throw new CustomError('User not found.');
    }

    return mentor;
  };

  rejectMentor = async (mentorId: string): Promise<IMentor> => {
    const mentor = await this.mentorRepository.updateMentorStatus(mentorId, 'rejected');
    if (!mentor) {
      throw new CustomError('Mentor application not found.');
    }
    return mentor;
  };

  getStatus = async (userId: string): Promise<MentorStatus | null> => {
    const mentor = await this.findOne({ userId });

    if (!mentor) {
      return null; // User hasn't applied yet
    }

    return mentor.status;
  };

  getAllMentors = async (): Promise<IMentor[] | null> => {
    return await this.mentorRepository.getAllMentors();
  };
}
