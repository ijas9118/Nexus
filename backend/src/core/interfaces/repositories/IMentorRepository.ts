import { BaseRepository } from '@/core/abstracts/base.repository';
import { AvailabilityType } from '@/core/types/entities/mentor';
import { IMentor } from '@/models/mentor.model';

export interface IMentorRepository extends BaseRepository<IMentor> {
  createMentorApplication(userId: string, mentorData: Partial<IMentor>): Promise<IMentor>;

  findMentorByUserId(userId: string): Promise<IMentor | null>;

  updateMentorStatus(
    mentorId: string,
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<IMentor | null>;

  getAllMentors(): Promise<IMentor[] | null>;

  getApprovedMentors(): Promise<IMentor[] | null>;

  getMentorDetails(mentorId: string): Promise<IMentor | null>;

  updateAvailability(mentorId: string, availabilityType: AvailabilityType): Promise<boolean>;

  updateMentorExperience(
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
  ): Promise<IMentor | null>;

  updateMentorshipDetails(
    userId: string,
    mentorshipDetailsData: {
      mentorshipTypes: string[];
      targetAudiences: string[];
    }
  ): Promise<IMentor | null>;
}
