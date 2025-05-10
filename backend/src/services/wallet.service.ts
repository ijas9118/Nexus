import { BaseService } from '@/core/abstracts/base.service';
import { IWalletRepository } from '@/core/interfaces/repositories/IWalletRepository';
import { IWalletService } from '@/core/interfaces/services/IWalletService';
import { WalletInfo } from '@/core/types/wallet.types';
import { TYPES } from '@/di/types';
import { IWallet } from '@/models/wallet.model';
import { injectable, inject } from 'inversify';
import mongoose from 'mongoose';

@injectable()
export class WalletService extends BaseService<IWallet> implements IWalletService {
  constructor(@inject(TYPES.WalletRepository) protected repository: IWalletRepository) {
    super(repository);
  }

  async addMoney(
    userId: string,
    amount: number,
    bookingId?: string,
    menteeId?: string
  ): Promise<WalletInfo> {
    let wallet = await this.repository.getWalletByUserId(userId);
    if (!wallet) {
      wallet = await this.create({ userId, balance: 0, transactions: [] });
    }

    const transaction = await this.repository.addTransaction({
      type: 'incoming',
      bookingId: bookingId ? new mongoose.Types.ObjectId(bookingId) : undefined,
      amount,
      userId: new mongoose.Types.ObjectId(userId),
      menteeId: menteeId ? new mongoose.Types.ObjectId(menteeId) : undefined,
      status: 'completed',
    });

    await this.repository.updateWalletBalance(
      wallet._id.toString(),
      amount,
      transaction._id.toString()
    );

    return this.getWalletInfo(userId);
  }

  async withdrawMoney(userId: string, amount: number, withdrawalNote: string): Promise<WalletInfo> {
    const wallet = await this.repository.getWalletByUserId(userId);
    if (!wallet) throw new Error('Wallet not found');
    if (wallet.balance < amount) throw new Error('Insufficient balance');

    const transaction = await this.repository.addTransaction({
      type: 'withdrawal',
      amount: -amount,
      userId: new mongoose.Types.ObjectId(userId),
      status: 'pending',
      withdrawalNote,
    });

    await this.repository.updateWalletBalance(
      wallet._id.toString(),
      -amount,
      transaction._id.toString()
    );

    return this.getWalletInfo(userId);
  }

  async getWalletInfo(userId: string, status?: 'pending' | 'completed'): Promise<WalletInfo> {
    const wallet = await this.repository.getWalletByUserId(userId);
    const transactions = await this.repository.getTransactionsByUserId(userId, status);

    return {
      balance: wallet?.balance || 0,
      transactions,
    };
  }
}
