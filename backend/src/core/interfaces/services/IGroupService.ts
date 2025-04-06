import { IGroup } from '@/models/group.model';

export interface IGroupService {
  createGroup(userId: string, name: string, memberIds: string[]): Promise<IGroup>;
  getUserGroups(userId: string): Promise<IGroup[]>;
}
