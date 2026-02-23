import { inject, injectable } from "inversify";

import type { IFollowersRepository } from "@/core/interfaces/repositories/i-followers-repository";
import type { IFollowersService } from "@/core/interfaces/services/i-followers-service";
import type { IUserWhoFollow } from "@/core/types/user-types";

import { TYPES } from "@/di/types";

@injectable()
export class FollowersService implements IFollowersService {
  constructor(
    @inject(TYPES.FollowersRepository) private _followersRepository: IFollowersRepository,
  ) {}

  followUser = async (followerId: string, followedId: string): Promise<boolean> => {
    return this._followersRepository.followUser(followerId, followedId);
  };

  unfollowUser = async (followerId: string, followedId: string): Promise<boolean> => {
    return this._followersRepository.unfollowUser(followerId, followedId);
  };

  getFollowers = async (
    userId: string,
    currentUserId: string,
  ): Promise<(IUserWhoFollow & { isFollowing: boolean; isConnected: boolean })[]> => {
    return this._followersRepository.getFollowers(userId, currentUserId);
  };

  getFollowing = async (userId: string): Promise<IUserWhoFollow[]> => {
    return this._followersRepository.getFollowing(userId);
  };

  getConnections = async (userId: string): Promise<IUserWhoFollow[]> => {
    return this._followersRepository.getConnections(userId);
  };

  isFollowing = async (followerId: string, followedId: string): Promise<boolean> => {
    return this._followersRepository.isFollowing(followerId, followedId);
  };

  getFollowStats = async (
    userId: string,
  ): Promise<{
    followersCount: number;
    followingCount: number;
    connectionsCount: number;
  }> => {
    return this._followersRepository.getFollowStats(userId);
  };
}
