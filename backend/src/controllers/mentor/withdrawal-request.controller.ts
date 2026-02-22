import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IWithdrawalRequestController } from "@/core/interfaces/controllers/i-withdrawal-request-controller";
import type { IWithdrawalRequestService } from "@/core/interfaces/services/i-withdrawal-request-service";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";

const { MENTOR_MESSAGES } = MESSAGES;

@injectable()
export class WithdrawalRequestController implements IWithdrawalRequestController {
  constructor(
    @inject(TYPES.WithdrawalRequestService)
    private _withdrawalRequestService: IWithdrawalRequestService,
  ) {}

  getPendingRequests = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const requests = await this._withdrawalRequestService.getPendingRequests();
    res.status(StatusCodes.OK).json(requests);
  });

  getUserPendingRequests = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const requests = await this._withdrawalRequestService.getRequestsByUserId(userId, "pending");
    res.status(StatusCodes.OK).json(requests);
  });

  approveWithdrawal = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { requestId } = req.body;
    const walletInfo = await this._withdrawalRequestService.approveWithdrawal(requestId);
    res.status(StatusCodes.OK).json(walletInfo);
  });

  rejectWithdrawal = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { requestId } = req.body;
    await this._withdrawalRequestService.rejectWithdrawal(requestId);
    res.status(StatusCodes.OK).json({ message: MENTOR_MESSAGES.WITHDRAWAL_REJECTED });
  });
}
