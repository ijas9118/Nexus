import type { IUserWhoFollow } from "@/core/types/user-types";

export interface IFollowersService {
  followUser: (followerId: string, followedId: string) => Promise<boolean>;
  unfollowUser: (followerId: string, followedId: string) => Promise<boolean>;
  getFollowers: (
    userId: string,
    currentUserId: string,
  ) => Promise<(IUserWhoFollow & { isFollowing: boolean })[]>;
  getFollowing: (userId: string) => Promise<IUserWhoFollow[]>;
  getConnections: (userId: string) => Promise<IUserWhoFollow[]>;
  isFollowing: (followerId: string, followedId: string) => Promise<boolean>;
  getFollowStats: (userId: string) => Promise<{
    followersCount: number;
    followingCount: number;
    connectionsCount: number;
  }>;
}
