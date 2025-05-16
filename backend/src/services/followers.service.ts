import { inject, injectable } from 'inversify';
import { IFollowersService } from '../core/interfaces/services/IFollowersService';
import { TYPES } from '../di/types';
import { IFollowersRepository } from '../core/interfaces/repositories/IFollowersRepository';
import { IUserWhoFollow } from '../core/types/UserTypes';

@injectable()
export class FollowersService implements IFollowersService {
  constructor(
    @inject(TYPES.FollowersRepository) private followersRepository: IFollowersRepository
  ) {}

  followUser = async (followerId: string, followedId: string): Promise<boolean> => {
    return this.followersRepository.followUser(followerId, followedId);
  };

  unfollowUser = async (followerId: string, followedId: string): Promise<boolean> => {
    return this.followersRepository.unfollowUser(followerId, followedId);
  };

  getFollowers = async (
    userId: string,
    currentUserId: string
  ): Promise<(IUserWhoFollow & { isFollowing: boolean })[]> => {
    return this.followersRepository.getFollowers(userId, currentUserId);
  };

  getFollowing = async (userId: string): Promise<IUserWhoFollow[]> => {
    return this.followersRepository.getFollowing(userId);
  };

  getConnections = async (userId: string): Promise<IUserWhoFollow[]> => {
    return this.followersRepository.getConnections(userId);
  };

  isFollowing = async (followerId: string, followedId: string): Promise<boolean> => {
    return this.followersRepository.isFollowing(followerId, followedId);
  };

  getFollowStats = async (
    userId: string
  ): Promise<{
    followersCount: number;
    followingCount: number;
    connectionsCount: number;
  }> => {
    return this.followersRepository.getFollowStats(userId);
  };
}
