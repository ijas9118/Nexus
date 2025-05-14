import { IMentorDashboardController } from '@/core/interfaces/controllers/IMentorDashboardController';
import { TYPES } from '@/di/types';
import { MentorDashboardService } from '@/services/mentor-dashboard.service';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { injectable, inject } from 'inversify';

@injectable()
export class MentorDashboardController implements IMentorDashboardController {
  constructor(@inject(TYPES.MentorDashboardService) private service: MentorDashboardService) {}

  getEarnings = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;
    const data = await this.service.getEarnings(userId);
    res.json(data);
  });

  getPendingWithdrawalWithBalance = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;
    const data = await this.service.getPendingWithdrawalWithBalance(userId);
    res.json(data);
  });

  getSessionStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;
    const data = await this.service.getSessionStats(userId);
    res.json(data);
  });

  getRecentBookings = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;
    const data = await this.service.getRecentBookings(userId);
    res.json(data);
  });

  // getRecentTransactions = asyncHandler(async (req: Request, res: Response) => {
  //   const userId = req.user?._id as string;
  //   const data = await this.service.getRecentTransactions(userId);
  //   res.json(data);
  // });

  // getMentorshipTypeStats = asyncHandler(async (req: Request, res: Response) => {
  //   const userId = req.user?._id as string;
  //   const data = await this.service.getMentorshipTypeStats(userId);
  //   res.json(data);
  // });
}
