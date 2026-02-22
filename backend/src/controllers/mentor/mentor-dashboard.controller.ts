import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IMentorDashboardController } from "@/core/interfaces/controllers/i-mentor-dashboard-controller";
import type { MentorDashboardService } from "@/services/mentor/mentor-dashboard.service";

import { TYPES } from "@/di/types";

@injectable()
export class MentorDashboardController implements IMentorDashboardController {
  constructor(@inject(TYPES.MentorDashboardService) private _service: MentorDashboardService) {}

  getEarnings = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;
    const data = await this._service.getEarnings(userId);
    res.status(StatusCodes.OK).json(data);
  });

  getPendingWithdrawalWithBalance = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;
    const data = await this._service.getPendingWithdrawalWithBalance(userId);
    res.status(StatusCodes.OK).json(data);
  });

  getSessionStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;
    const data = await this._service.getSessionStats(userId);
    res.status(StatusCodes.OK).json(data);
  });

  getRecentBookings = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;
    const data = await this._service.getRecentBookings(userId);
    res.status(StatusCodes.OK).json(data);
  });
}
