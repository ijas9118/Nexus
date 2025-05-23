import { IWalletRepository } from '@/core/interfaces/repositories/IWalletRepository';
import { IWithdrawalRequestRepository } from '@/core/interfaces/repositories/IWithdrawalRequestRepository';
import { INexusPointRepository } from '@/core/interfaces/repositories/INexusPointRepository';
import { IBookingService } from '@/core/interfaces/services/IBookingService';
import { IWalletService } from '@/core/interfaces/services/IWalletService';
import { WalletInfo } from '@/core/types/wallet.types';
import { TYPES } from '@/di/types';
import CustomError from '@/utils/CustomError';
import { generateTransactionId } from '@/utils/transactionUtils';
import { StatusCodes } from 'http-status-codes';
import { injectable, inject } from 'inversify';
import mongoose from 'mongoose';

@injectable()
export class WalletService implements IWalletService {
  private NEXUS_COIN_VALUE = 10; // 1 nexus coin = 10 rupees

  constructor(
    @inject(TYPES.WalletRepository) protected repository: IWalletRepository,
    @inject(TYPES.BookingService) private bookingService: IBookingService,
    @inject(TYPES.WithdrawalRequestRepository)
    private withdrawalRequestRepository: IWithdrawalRequestRepository,
    @inject(TYPES.NexusPointRepository) private nexusPointRepository: INexusPointRepository
  ) {}

  async addMoney(
    userId: string,
    amount: number,
    bookingId?: string,
    menteeId?: string
  ): Promise<WalletInfo> {
    if (bookingId) {
      const booking = await this.bookingService.getBookingById(bookingId);
      if (!booking) {
        throw new CustomError('Booking not found', StatusCodes.BAD_REQUEST);
      }
    }

    let wallet = await this.repository.getWalletByUserId(userId);
    if (!wallet) {
      wallet = await this.repository.create({
        userId,
        balance: 0,
        nexusPoints: 0,
        transactions: [],
      });
    }

    const transactionId = generateTransactionId();

    const transaction = await this.repository.addTransaction({
      type: 'incoming',
      transactionId,
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

  async requestWithdrawal(
    userId: string,
    amount: number,
    withdrawalNote: string,
    nexusPoints?: number
  ): Promise<void> {
    const wallet = await this.repository.getWalletByUserId(userId);
    if (!wallet) throw new CustomError('Wallet not found', StatusCodes.NOT_FOUND);
    if (amount > 0 && wallet.balance < amount)
      throw new CustomError('Insufficient balance', StatusCodes.BAD_REQUEST);
    if (nexusPoints && wallet.nexusPoints < nexusPoints)
      throw new CustomError('Insufficient nexus points', StatusCodes.BAD_REQUEST);

    const calculatedAmount =
      (amount || 0) + (nexusPoints ? nexusPoints * this.NEXUS_COIN_VALUE : 0);

    await this.withdrawalRequestRepository.create({
      userId: new mongoose.Types.ObjectId(userId),
      amount: calculatedAmount,
      nexusPoints: nexusPoints || 0,
      withdrawalNote,
      status: 'pending',
    });

    if (nexusPoints) {
      await this.nexusPointRepository.addPointsTransaction({
        userId: new mongoose.Types.ObjectId(userId),
        points: -nexusPoints,
        type: 'redeemed',
        description: `Redeemed ${nexusPoints} nexus points for withdrawal`,
      });

      await this.repository.update(wallet._id, {
        nexusPoints: wallet.nexusPoints - nexusPoints,
      });
    }
  }

  async approveWithdrawal(requestId: string): Promise<WalletInfo> {
    const request = await this.withdrawalRequestRepository.findById(requestId);
    if (!request) throw new CustomError('Withdrawal request not found', StatusCodes.NOT_FOUND);
    if (request.status !== 'pending')
      throw new CustomError('Request already processed', StatusCodes.BAD_REQUEST);

    const wallet = await this.repository.getWalletByUserId(request.userId.toString());
    if (!wallet) throw new CustomError('Wallet not found', StatusCodes.NOT_FOUND);
    if (request.amount > wallet.balance)
      throw new CustomError('Insufficient balance', StatusCodes.BAD_REQUEST);

    const transactionId = generateTransactionId();
    const transaction = await this.repository.addTransaction({
      type: 'withdrawal',
      amount: request.amount,
      userId: request.userId,
      status: 'completed',
      withdrawalNote: request.withdrawalNote,
      transactionId,
    });

    await this.repository.updateWalletBalance(
      wallet._id.toString(),
      -request.amount,
      transaction._id.toString()
    );

    await this.withdrawalRequestRepository.updateRequestStatus(
      requestId,
      'approved',
      transaction._id.toString()
    );

    return this.getWalletInfo(request.userId.toString());
  }

  async rejectWithdrawal(requestId: string): Promise<void> {
    const request = await this.withdrawalRequestRepository.findById(requestId);
    if (!request) throw new CustomError('Withdrawal request not found', StatusCodes.NOT_FOUND);
    if (request.status !== 'pending')
      throw new CustomError('Request already processed', StatusCodes.BAD_REQUEST);

    if ((request.nexusPoints ?? 0) > 0) {
      const wallet = await this.repository.getWalletByUserId(request.userId.toString());
      if (wallet) {
        await this.repository.update(wallet._id, {
          nexusPoints: wallet.nexusPoints + (request.nexusPoints ?? 0),
        });

        await this.nexusPointRepository.addPointsTransaction({
          userId: request.userId,
          points: request.nexusPoints,
          type: 'earned',
          description: `Restored ${request.nexusPoints} nexus points due to rejected withdrawal`,
        });
      }
    }

    await this.withdrawalRequestRepository.updateRequestStatus(requestId, 'rejected');
  }

  async addNexusPoints(userId: string, points: number, description: string): Promise<WalletInfo> {
    let wallet = await this.repository.getWalletByUserId(userId);
    if (!wallet) {
      wallet = await this.repository.create({
        userId,
        balance: 0,
        nexusPoints: 0,
        transactions: [],
      });
    }

    await this.nexusPointRepository.addPointsTransaction({
      userId: new mongoose.Types.ObjectId(userId),
      points,
      type: 'earned',
      description,
    });

    await this.repository.update(wallet._id, {
      nexusPoints: wallet.nexusPoints + points,
    });

    return this.getWalletInfo(userId);
  }

  async getWalletInfo(userId: string, status?: 'pending' | 'completed'): Promise<WalletInfo> {
    const wallet = await this.repository.getWalletByUserId(userId);
    const transactions = await this.repository.getTransactionsByUserId(userId, status);
    const pointTransactions = await this.nexusPointRepository.getPointsByUserId(userId);

    return {
      balance: wallet?.balance || 0,
      nexusPoints: wallet?.nexusPoints || 0,
      transactions,
      pointTransactions: pointTransactions.map((pt) => ({
        _id: pt._id.toString(),
        points: pt.points,
        type: pt.type,
        description: pt.description,
        createdAt: pt.createdAt,
      })),
    };
  }
}
