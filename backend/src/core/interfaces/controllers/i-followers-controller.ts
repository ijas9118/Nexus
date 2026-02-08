import type { RequestHandler } from 'express';

export interface IFollowersController {
  followUser: RequestHandler;
  unfollowUser: RequestHandler;
  getFollowers: RequestHandler;
  getFollowing: RequestHandler;
  getConnections: RequestHandler;
  isFollowing: RequestHandler;
  getFollowStats: RequestHandler;
}
