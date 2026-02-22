import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IWalletController } from "@/core/interfaces/controllers/i-wallet-controller";
import type { IWalletService } from "@/core/interfaces/services/i-wallet-service";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";

const { PAYMENT_MESSAGES } = MESSAGES;

@injectable()
export class WalletController implements IWalletController {
  constructor(@inject(TYPES.WalletService) private _walletService: IWalletService) {}

  addMoney = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { amount, bookingId, menteeId } = req.body;
    const walletInfo = await this._walletService.addMoney(userId, amount, bookingId, menteeId);
    res.status(StatusCodes.OK).json(walletInfo);
  });

  requestWithdrawal = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { amount, nexusPoints, withdrawalNote } = req.body;
    await this._walletService.requestWithdrawal(userId, amount || 0, withdrawalNote, nexusPoints);
    res.status(StatusCodes.OK).json({ message: PAYMENT_MESSAGES.WITHDRAWAL_SUBMITTED });
  });

  addNexusPoints = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { points, description } = req.body;
    const walletInfo = await this._walletService.addNexusPoints(userId, points, description);
    res.status(StatusCodes.OK).json(walletInfo);
  });

  getWalletInfo = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { status } = req.query;
    const walletInfo = await this._walletService.getWalletInfo(
      userId,
      status as "pending" | "completed",
    );
    res.status(StatusCodes.OK).json(walletInfo);
  });
}
