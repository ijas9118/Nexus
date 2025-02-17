import { IFollower } from "../../../models/followers.model";

export interface IFollowersRepository {
  followUser(followerId: string, followedId: string): Promise<IFollower | null>;
  unfollowUser(followerId: string, followedId: string): Promise<boolean>;
  getFollowers(userId: string): Promise<IFollower[]>;
  getFollowing(userId: string): Promise<IFollower[]>;
  isFollowing(followerId: string, followedId: string): Promise<boolean>;
}
