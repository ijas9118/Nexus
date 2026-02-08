import type { RequestHandler } from "express";

export interface IAdminAuthController {
  login: RequestHandler;
  logout: RequestHandler;
  verifyToken: RequestHandler;
}
