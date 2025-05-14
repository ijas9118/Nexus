import { RequestHandler } from 'express';

export interface IMentorDashboardController {
  getPendingWithdrawalWithBalance: RequestHandler;
  getSessionStats: RequestHandler;
  getEarnings: RequestHandler;
  getRecentBookings: RequestHandler;
}
