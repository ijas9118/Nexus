import { IGroup } from '@/models/group.model';
import { IBaseRepository } from './IBaseRepository';

export interface IGroupRepository extends IBaseRepository<IGroup> {
  getUserGroups(userId: string): Promise<IGroup[]>;
}
