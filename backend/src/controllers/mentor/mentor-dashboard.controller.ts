import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
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
    res.json(data);
  });

  getPendingWithdrawalWithBalance = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;
    const data = await this._service.getPendingWithdrawalWithBalance(userId);
    res.json(data);
  });

  getSessionStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;
    const data = await this._service.getSessionStats(userId);
    res.json(data);
  });

  getRecentBookings = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string;
    const data = await this._service.getRecentBookings(userId);
    res.json(data);
  });

  // getRecentTransactions = asyncHandler(async (req: Request, res: Response) => {
  //   const userId = req.user?._id as string;
  //   const data = await this._service.getRecentTransactions(userId);
  //   res.json(data);
  // });

  // getMentorshipTypeStats = asyncHandler(async (req: Request, res: Response) => {
  //   const userId = req.user?._id as string;
  //   const data = await this._service.getMentorshipTypeStats(userId);
  //   res.json(data);
  // });
}
