import { RequestHandler } from 'express';

export interface IAdminDashboardController {
  getDashboardStats: RequestHandler;
}
