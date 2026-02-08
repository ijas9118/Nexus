import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import type { IWithdrawalRequestController } from "@/core/interfaces/controllers/i-withdrawal-request-controller";
import type { IWithdrawalRequestRepository } from "@/core/interfaces/repositories/i-withdrawal-request-repository";
import type { IWalletService } from "@/core/interfaces/services/i-wallet-service";

import { TYPES } from "@/di/types";

@injectable()
export class WithdrawalRequestController implements IWithdrawalRequestController {
  constructor(
    @inject(TYPES.WalletService) private walletService: IWalletService,
    @inject(TYPES.WithdrawalRequestRepository)
    private withdrawalRequestRepository: IWithdrawalRequestRepository,
  ) {}

  getPendingRequests = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const requests = await this.withdrawalRequestRepository.getPendingRequests();
    res.status(200).json(requests);
  });

  getUserPendingRequests = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const requests = await this.withdrawalRequestRepository.getRequestsByUserId(userId, "pending");
    res.status(200).json(requests);
  });

  approveWithdrawal = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { requestId } = req.body;
    const walletInfo = await this.walletService.approveWithdrawal(requestId);
    res.status(200).json(walletInfo);
  });

  rejectWithdrawal = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { requestId } = req.body;
    await this.walletService.rejectWithdrawal(requestId);
    res.status(200).json({ message: "Withdrawal request rejected" });
  });
}
