import { IUserWhoFollow } from '../../types/UserTypes';

export interface IFollowersService {
  followUser(followerId: string, followedId: string): Promise<boolean>;
  unfollowUser(followerId: string, followedId: string): Promise<boolean>;
  getFollowers(userId: string): Promise<IUserWhoFollow[]>;
  getFollowing(userId: string): Promise<IUserWhoFollow[]>;
  isFollowing(followerId: string, followedId: string): Promise<boolean>;
}
