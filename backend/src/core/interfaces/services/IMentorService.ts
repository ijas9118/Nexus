import { PersonalInfo } from '@/core/types';
import { MentorStatus } from '@/core/types/entities/mentor';
import { IMentor } from '@/models/mentor.model';
import { IMentorshipType } from '@/models/mentorship-type.model';

export interface IMentorService {
  applyAsMentor(
    userId: string,
    data: {
      personalInfo: PersonalInfo;
      experience: IMentor['experience'];
      mentorshipDetails: IMentor['mentorshipDetails'];
    }
  ): Promise<IMentor>;

  approveMentor(mentorId: string, userId: string): Promise<IMentor>;

  rejectMentor(mentorId: string): Promise<IMentor>;

  getStatus(userId: string): Promise<MentorStatus | null>;

  getAllMentors(): Promise<IMentor[] | null>;

  getApprovedMentors(): Promise<IMentor[] | null>;

  getMentorDetails(mentorId: string): Promise<IMentor | null>;

  getMentorByUserId(userId: string): Promise<IMentor | null>;

  getUserIdByMentorId(mentorId: string): Promise<string>;

  getMentorshipTypes(mentorId: string): Promise<IMentorshipType[]>;

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
  ): Promise<IMentor>;

  updateMentorshipDetails(
    userId: string,
    mentorshipDetailsData: {
      mentorshipTypes: string[];
      targetAudiences: string[];
    }
  ): Promise<IMentor>;
}
