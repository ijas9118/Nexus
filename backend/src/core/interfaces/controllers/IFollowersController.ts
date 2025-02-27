import { RequestHandler } from "express";

export interface IFollowersController {
  followUser: RequestHandler;
  unfollowUser: RequestHandler;
  getFollowers: RequestHandler;
  getFollowing: RequestHandler;
  isFollowing: RequestHandler;
  sendConnectionRequest: RequestHandler;
  acceptConnectionRequest: RequestHandler;
  hasSentConnectionRequest: RequestHandler;
  withdrawConnectionRequest: RequestHandler;
  getAllConnections: RequestHandler;
}
