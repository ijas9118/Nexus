import type { Request, Response } from 'express';

import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import type { IAdminDashboardController } from '@/core/interfaces/controllers/i-admin-dashboard-controller';
import type { IAdminDashboardService } from '@/core/interfaces/services/i-admin-dashboard-service';

import { TYPES } from '@/di/types';

@injectable()
export class AdminDashboardController implements IAdminDashboardController {
  constructor(
    @inject(TYPES.AdminDashboardService) private adminDashboardService: IAdminDashboardService
  ) {}

  getDashboardStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await this.adminDashboardService.getStats();
    res.status(StatusCodes.OK).json(stats);
  });

  getSubscriptionStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await this.adminDashboardService.getSubscriptionStats();
    res.status(StatusCodes.OK).json(stats);
  });

  getRevenueStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const timeRange = (req.query.timeRange as string) || '30days';
    const stats = await this.adminDashboardService.getRevenueStats(timeRange);
    res.status(StatusCodes.OK).json(stats);
  });

  getMentorApplicationStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await this.adminDashboardService.getMentorApplicationStats();
    res.status(StatusCodes.OK).json(stats);
  });
}
