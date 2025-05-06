import { BaseService } from '@/core/abstracts/base.service';
import { IMentorRepository } from '@/core/interfaces/repositories/IMentorRepository';
import { IUserRepository } from '@/core/interfaces/repositories/IUserRepository';
import { IMentorService } from '@/core/interfaces/services/IMentorService';
import { PersonalInfo } from '@/core/types';
import { MentorStatus } from '@/core/types/entities/mentor';
import { TYPES } from '@/di/types';
import { IMentor } from '@/models/mentor.model';
import { IMentorshipType } from '@/models/mentorship-type.model';
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

  getApprovedMentors = async (): Promise<IMentor[] | null> => {
    return await this.mentorRepository.getApprovedMentors();
  };

  getMentorDetails = async (mentorId: string): Promise<IMentor | null> => {
    return await this.mentorRepository.getMentorDetails(mentorId);
  };

  getMentorByUserId = async (userId: string): Promise<IMentor | null> => {
    return await this.findOne({ userId });
  };

  getMentorshipTypes = async (mentorId: string): Promise<IMentorshipType[]> => {
    const mentor = await this.mentorRepository.getMentorDetails(mentorId);

    if (!mentor) {
      throw new CustomError('Mentor not found.');
    }

    const mentorshipTypes = mentor.mentorshipDetails?.mentorshipTypes;

    if (!mentorshipTypes || mentorshipTypes.length === 0) {
      return [];
    }

    return mentorshipTypes as unknown as IMentorshipType[];
  };

  updateMentorExperience = async (
    userId: string,
    experienceData: {
      currentRole: string;
      company: string;
      experienceLevel: string;
      expertiseAreas: string[];
      technologies: string[];
      bio: string;
      resume?: string | null;
    }
  ): Promise<IMentor> => {
    const mentor = await this.mentorRepository.findMentorByUserId(userId);
    if (!mentor) {
      throw new CustomError('Mentor not found.');
    }

    const updatedMentor = await this.mentorRepository.updateMentorExperience(
      userId,
      experienceData
    );
    if (!updatedMentor) {
      throw new CustomError('Failed to update mentor experience.');
    }

    return updatedMentor;
  };

  updateMentorshipDetails = async (
    userId: string,
    mentorshipDetailsData: {
      mentorshipTypes: string[];
      targetAudiences: string[];
    }
  ): Promise<IMentor> => {
    const mentor = await this.mentorRepository.findMentorByUserId(userId);
    if (!mentor) {
      throw new CustomError('Mentor not found.');
    }

    const updatedMentor = await this.mentorRepository.updateMentorshipDetails(
      userId,
      mentorshipDetailsData
    );
    if (!updatedMentor) {
      throw new CustomError('Failed to update mentorship details.');
    }

    return updatedMentor;
  };
}
