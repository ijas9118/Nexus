import type { RequestHandler } from 'express';

export interface IContentController {
  createContent: RequestHandler;
  getContent: RequestHandler;
  getAllContent: RequestHandler;
  getPosts: RequestHandler;
  verifyContent: RequestHandler;
  getFollowingUsersContents: RequestHandler;
}
