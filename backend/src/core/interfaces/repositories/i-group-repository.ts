import type { IGroup } from "@/models/group.model";

import type { IBaseRepository } from "./i-base-repository";

export interface IGroupRepository extends IBaseRepository<IGroup> {
  getUserGroups: (userId: string) => Promise<IGroup[]>;
}
