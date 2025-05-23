import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import { IAdminDashboardController } from '@/core/interfaces/controllers/IAdminDashboardController';
import { IAdminDashboardService } from '@/core/interfaces/services/IAdminDashboardService';

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
