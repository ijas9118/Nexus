import { RequestHandler } from 'express';

export interface IAdminDashboardController {
  getDashboardStats: RequestHandler;
  getSubscriptionStats: RequestHandler;
  getRevenueStats: RequestHandler;
  getMentorApplicationStats: RequestHandler;
}
