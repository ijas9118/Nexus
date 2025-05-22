import { RequestHandler } from 'express';

export interface IAdminController {
  getUsers: RequestHandler;
  getUserById: RequestHandler;
  updateUser: RequestHandler;
  blockUser: RequestHandler;
  unblockUser: RequestHandler;
}
