import { BaseRepository } from '@/core/abstracts/base.repository';
import { IMentor, MentorModel } from '../models/mentor.model';
import { IMentorRepository } from '@/core/interfaces/repositories/IMentorRepository';
import { injectable } from 'inversify';

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
    return await MentorModel.findOne({ userId })
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
    return await MentorModel.findByIdAndUpdate(mentorId, { status }, { new: true });
  }
}
