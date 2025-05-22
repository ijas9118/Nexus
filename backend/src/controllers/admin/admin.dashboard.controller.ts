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
}
