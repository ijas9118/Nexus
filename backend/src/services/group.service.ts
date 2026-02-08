import { inject, injectable } from "inversify";

import type { IGroupRepository } from "@/core/interfaces/repositories/i-group-repository";
import type { IConnectionService } from "@/core/interfaces/services/i-connection-service";
import type { IGroupService } from "@/core/interfaces/services/i-group-service";
import type { IGroup } from "@/models/group.model";

import { TYPES } from "@/di/types";

@injectable()
export class GroupService implements IGroupService {
  constructor(
    @inject(TYPES.GroupRepository) protected repository: IGroupRepository,
    @inject(TYPES.ConnectionService) private connectionService: IConnectionService,
  ) {}

  async createGroup(userId: string, name: string, memberIds: string[]): Promise<IGroup> {
    const allMembers = [...new Set([userId, ...memberIds])];

    // Validate all members are connected to the creator
    const invalidMembers: string[] = [];
    for (const memberId of memberIds) {
      if (memberId !== userId) {
        const isConnected = await this.connectionService.isConnected(userId, memberId);
        if (!isConnected) {
          invalidMembers.push(memberId);
        }
      }
    }
    if (invalidMembers.length > 0) {
      throw new Error(`User is not connected to: ${invalidMembers.join(", ")}`);
    }

    return this.repository.create({
      name,
      members: allMembers,
      createdBy: userId,
    });
  }

  async getUserGroups(userId: string): Promise<IGroup[]> {
    return this.repository.getUserGroups(userId);
  }
}
