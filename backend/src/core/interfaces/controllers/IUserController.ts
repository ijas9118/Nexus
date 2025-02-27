import type { RequestHandler } from "express";

export interface IUserController {
  getUserJoinedSquads: RequestHandler;
  getUserData: RequestHandler;
  updateUser: RequestHandler;
  updatePassword: RequestHandler;
}
