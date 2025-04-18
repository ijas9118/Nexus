import { MentorStatus, PersonalInfo } from '@/core/types';
import { IMentor } from '@/models/mentor.model';

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
}
