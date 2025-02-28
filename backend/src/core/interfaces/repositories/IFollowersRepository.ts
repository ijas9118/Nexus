export interface IFollowersRepository {
  followUser(followerId: string, followedId: string): Promise<boolean>;
  unfollowUser(followerId: string, followedId: string): Promise<boolean>;
  getFollowers(userId: string): Promise<any[]>;
  getFollowing(userId: string): Promise<any[]>;
  isFollowing(followerId: string, followedId: string): Promise<boolean>;
  
}
