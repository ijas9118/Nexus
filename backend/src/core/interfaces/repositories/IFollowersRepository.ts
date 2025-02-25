export interface IFollowersRepository {
  followUser(followerId: string, followedId: string): Promise<boolean>;
  unfollowUser(followerId: string, followedId: string): Promise<boolean>;
  getFollowers(userId: string): Promise<any[]>;
  getFollowing(userId: string): Promise<any[]>;
  isFollowing(followerId: string, followedId: string): Promise<boolean>;
  sendConnectionRequest(requesterId: string, recipientId: string): Promise<boolean>;
  acceptConnectionRequest(requesterId: string, recipientId: string): Promise<boolean>;
  hasSentConnectionRequest(requesterId: string, recipientId: string): Promise<boolean>;
}
