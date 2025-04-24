import { BaseRepository } from '@/core/abstracts/base.repository';
import { IMentor, MentorModel } from '../models/mentor.model';
import { IMentorRepository } from '@/core/interfaces/repositories/IMentorRepository';
import { injectable } from 'inversify';
import { AvailabilityType } from '@/core/types/entities/mentor';

@injectable()
export class MentorRepository extends BaseRepository<IMentor> implements IMentorRepository {
  constructor() {
    super(MentorModel);
  }

  createMentorApplication = async (
    userId: string,
    mentorData: Partial<IMentor>
  ): Promise<IMentor> => {
    return this.create({ userId, ...mentorData, status: 'pending' } as Partial<IMentor>);
  };

  findMentorByUserId = async (userId: string): Promise<IMentor | null> => {
    return await this.model
      .findOne({ userId })
      .populate('experience.experienceLevel')
      .populate('experience.expertiseAreas')
      .populate('experience.technologies')
      .populate('mentorshipDetails.mentorshipTypes')
      .populate('mentorshipDetails.targetAudiences');
  };

  async updateMentorStatus(
    mentorId: string,
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<IMentor | null> {
    return await this.model.findByIdAndUpdate(mentorId, { status }, { new: true });
  }

  getAllMentors = async (): Promise<IMentor[]> => {
    return await this.model
      .find(
        {},
        {
          _id: 1,
          userId: 1,
          status: 1,
          'experience.currentRole': 1,
          'experience.expertiseAreas': 1,
          'experience.bio': 1,
        }
      )
      .populate('userId', 'name profilePic email') // Only what's used
      .lean();
  };

  getApprovedMentors = async (): Promise<IMentor[]> => {
    return await this.model
      .find(
        { status: 'approved' },
        {
          _id: 1,
          userId: 1,
          'experience.currentRole': 1,
          'experience.expertiseAreas': 1,
          'experience.bio': 1,
        }
      )
      .populate('userId', 'name profilePic email') // Only what's used
      .lean();
  };

  getMentorDetails = async (mentorId: string): Promise<IMentor | null> => {
    return await this.model
      .findById(mentorId)
      .populate('userId', 'name email profilePic username location') // 👈 pick what you need
      .populate('experience.experienceLevel')
      .populate('experience.expertiseAreas')
      .populate('experience.technologies')
      .populate('mentorshipDetails.mentorshipTypes')
      .populate('mentorshipDetails.targetAudiences');
  };

  updateAvailability = async (
    mentorId: string,
    availabilityType: AvailabilityType
  ): Promise<boolean> => {
    const result = await this.findOneAndUpdate(
      { userId: mentorId },
      {
        $set: {
          'mentorshipDetails.availabilityType': availabilityType,
        },
      }
    );
    console.log(availabilityType, mentorId);
    return !!result;
  };
}
