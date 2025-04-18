import { BaseRepository } from '@/core/abstracts/base.repository';
import { IMentor } from '@/models/mentor.model';

export interface IMentorRepository extends BaseRepository<IMentor> {
  createMentorApplication(userId: string, mentorData: Partial<IMentor>): Promise<IMentor>;

  findMentorByUserId(userId: string): Promise<IMentor | null>;

  updateMentorStatus(
    mentorId: string,
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<IMentor | null>;

  getAllMentors(): Promise<IMentor[] | null>;

  getMentorDetails(mentorId: string): Promise<IMentor | null>;
}
