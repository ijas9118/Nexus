import { IMentorshipType } from '@/models/mentorship-type.model';

export interface IMentorshipTypeService {
  createMentorshipType(data: { name: string; description: string }): Promise<IMentorshipType>;
  getMentorshipType(id: string): Promise<IMentorshipType>;
  getAllMentorshipTypes(options?: { includeInactive?: boolean }): Promise<IMentorshipType[]>;
  updateMentorshipType(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      defaultPrice: number;
    }>
  ): Promise<IMentorshipType>;
  deleteMentorshipType(id: string): Promise<void>;
  restoreMentorshipType(id: string): Promise<void>;
}
