import { injectable } from "inversify";

import type { IGroupRepository } from "@/core/interfaces/repositories/i-group-repository";
import type { IGroup } from "@/models/group.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { GroupModel } from "@/models/group.model";

@injectable()
export class GroupRepository extends BaseRepository<IGroup> implements IGroupRepository {
  constructor() {
    super(GroupModel);
  }

  async getUserGroups(userId: string): Promise<IGroup[]> {
    return this.model.find({ members: userId });
  }
}
