import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IWalletService } from '@/core/interfaces/services/IWalletService';
import { TYPES } from '@/di/types';
import { IWalletController } from '@/core/interfaces/controllers/IWalletController';
import asyncHandler from 'express-async-handler';

@injectable()
export class WalletController implements IWalletController {
  constructor(@inject(TYPES.WalletService) private walletService: IWalletService) {}

  addMoney = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId, amount, bookingId, menteeId } = req.body;
    const walletInfo = await this.walletService.addMoney(userId, amount, bookingId, menteeId);
    res.status(200).json(walletInfo);
  });

  withdrawMoney = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId, amount, withdrawalNote } = req.body;
    const walletInfo = await this.walletService.withdrawMoney(userId, amount, withdrawalNote);
    res.status(200).json(walletInfo);
  });

  getWalletInfo = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const { status } = req.query;
    const walletInfo = await this.walletService.getWalletInfo(
      userId,
      status as 'pending' | 'completed'
    );
    res.status(200).json(walletInfo);
  });
}
