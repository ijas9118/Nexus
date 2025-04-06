import { BaseRepository } from '@/core/abstracts/base.repository';
import { IGroupRepository } from '@/core/interfaces/repositories/IGroupRepository';
import { GroupModel, IGroup } from '@/models/group.model';
import { injectable } from 'inversify';

@injectable()
export class GroupRepository extends BaseRepository<IGroup> implements IGroupRepository {
  constructor() {
    super(GroupModel);
  }

  async getUserGroups(userId: string): Promise<IGroup[]> {
    return this.model.find({ members: userId });
  }
}
