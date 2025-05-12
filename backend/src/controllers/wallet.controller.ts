import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IWalletService } from '@/core/interfaces/services/IWalletService';
import { IWalletController } from '@/core/interfaces/controllers/IWalletController';
import { TYPES } from '@/di/types';
import asyncHandler from 'express-async-handler';

@injectable()
export class WalletController implements IWalletController {
  constructor(@inject(TYPES.WalletService) private walletService: IWalletService) {}

  addMoney = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { amount, bookingId, menteeId } = req.body;
    const walletInfo = await this.walletService.addMoney(userId, amount, bookingId, menteeId);
    res.status(200).json(walletInfo);
  });

  requestWithdrawal = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { amount, nexusPoints, withdrawalNote } = req.body;
    await this.walletService.requestWithdrawal(userId, amount || 0, withdrawalNote, nexusPoints);
    res.status(200).json({ message: 'Withdrawal request submitted' });
  });

  addNexusPoints = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { points, description } = req.body;
    const walletInfo = await this.walletService.addNexusPoints(userId, points, description);
    res.status(200).json(walletInfo);
  });

  getWalletInfo = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { status } = req.query;
    const walletInfo = await this.walletService.getWalletInfo(
      userId,
      status as 'pending' | 'completed'
    );
    res.status(200).json(walletInfo);
  });
}
