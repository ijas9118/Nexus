import { IMentorshipType } from '@/models/mentorship-type.model';
import { IBaseService } from './IBaseService';

export interface IMentorshipTypeService extends IBaseService<IMentorshipType> {
  createMentorshipType(data: { name: string; description: string }): Promise<IMentorshipType>;
  getMentorshipType(id: string): Promise<IMentorshipType>;
  getAllMentorshipTypes(): Promise<IMentorshipType[]>;
  updateMentorshipType(
    id: string,
    data: Partial<{ name: string; description: string }>
  ): Promise<IMentorshipType>;
  deleteMentorshipType(id: string): Promise<void>;
}
