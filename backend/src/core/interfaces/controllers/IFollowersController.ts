import { RequestHandler } from 'express';

export interface IFollowersController {
  followUser: RequestHandler;
  unfollowUser: RequestHandler;
  getFollowers: RequestHandler;
  getFollowing: RequestHandler;
  isFollowing: RequestHandler;
  getFollowStats: RequestHandler;
}
