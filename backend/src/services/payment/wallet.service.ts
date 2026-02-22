import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { INexusPointRepository } from "@/core/interfaces/repositories/i-nexus-point-repository";
import type { IWalletRepository } from "@/core/interfaces/repositories/i-wallet-repository";
import type { IWithdrawalRequestRepository } from "@/core/interfaces/repositories/i-withdrawal-request-repository";
import type { IBookingService } from "@/core/interfaces/services/i-booking-service";
import type { IWalletService } from "@/core/interfaces/services/i-wallet-service";
import type { WalletInfo } from "@/core/types/wallet.types";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";
import { generateTransactionId } from "@/utils/transaction-utils";

const { WALLET_MESSAGES, BOOKING_MESSAGES } = MESSAGES;

@injectable()
export class WalletService implements IWalletService {
  private _NEXUS_COIN_VALUE = 10; // 1 nexus coin = 10 rupees

  constructor(
    @inject(TYPES.WalletRepository) protected _repository: IWalletRepository,
    @inject(TYPES.BookingService) private _bookingService: IBookingService,
    @inject(TYPES.WithdrawalRequestRepository)
    private _withdrawalRequestRepository: IWithdrawalRequestRepository,
    @inject(TYPES.NexusPointRepository) private _nexusPointRepository: INexusPointRepository,
  ) {}

  async addMoney(
    userId: string,
    amount: number,
    bookingId?: string,
    menteeId?: string,
  ): Promise<WalletInfo> {
    if (bookingId) {
      const booking = await this._bookingService.getBookingById(bookingId);
      if (!booking) {
        throw new CustomError(BOOKING_MESSAGES.BOOKING_NOT_FOUND, StatusCodes.BAD_REQUEST);
      }
    }

    let wallet = await this._repository.getWalletByUserId(userId);
    if (!wallet) {
      wallet = await this._repository.create({
        userId,
        balance: 0,
        nexusPoints: 0,
        transactions: [],
      });
    }

    const transactionId = generateTransactionId();

    const transaction = await this._repository.addTransaction({
      type: "incoming",
      transactionId,
      bookingId,
      amount,
      userId,
      menteeId,
      status: "completed",
    });

    await this._repository.updateWalletBalance(
      wallet._id.toString(),
      amount,
      transaction._id.toString(),
    );

    return this.getWalletInfo(userId);
  }

  async requestWithdrawal(
    userId: string,
    amount: number,
    withdrawalNote: string,
    nexusPoints?: number,
  ): Promise<void> {
    const wallet = await this._repository.getWalletByUserId(userId);
    if (!wallet) {
      throw new CustomError(WALLET_MESSAGES.NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    if (amount > 0 && wallet.balance < amount) {
      throw new CustomError(WALLET_MESSAGES.INSUFFICIENT_BALANCE, StatusCodes.BAD_REQUEST);
    }
    if (nexusPoints && wallet.nexusPoints < nexusPoints) {
      throw new CustomError(WALLET_MESSAGES.INSUFFICIENT_POINTS, StatusCodes.BAD_REQUEST);
    }

    const calculatedAmount
      = (amount || 0) + (nexusPoints ? nexusPoints * this._NEXUS_COIN_VALUE : 0);

    await this._withdrawalRequestRepository.create({
      userId,
      amount: calculatedAmount,
      nexusPoints: nexusPoints || 0,
      withdrawalNote,
      status: "pending",
    });

    if (nexusPoints) {
      await this._nexusPointRepository.addPointsTransaction({
        userId,
        points: -nexusPoints,
        type: "redeemed",
        description: `Redeemed ${nexusPoints} nexus points for withdrawal`,
      });

      await this._repository.update(wallet._id, {
        nexusPoints: wallet.nexusPoints - nexusPoints,
      });
    }
  }

  async approveWithdrawal(requestId: string): Promise<WalletInfo> {
    const request = await this._withdrawalRequestRepository.findById(requestId);
    if (!request) {
      throw new CustomError(WALLET_MESSAGES.WITHDRAWAL_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    if (request.status !== "pending") {
      throw new CustomError(WALLET_MESSAGES.REQUEST_PROCESSED, StatusCodes.BAD_REQUEST);
    }

    const wallet = await this._repository.getWalletByUserId(request.userId.toString());
    if (!wallet) {
      throw new CustomError(WALLET_MESSAGES.NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    if (request.amount > wallet.balance) {
      throw new CustomError(WALLET_MESSAGES.INSUFFICIENT_BALANCE, StatusCodes.BAD_REQUEST);
    }

    const transactionId = generateTransactionId();
    const transaction = await this._repository.addTransaction({
      type: "withdrawal",
      amount: request.amount,
      userId: request.userId,
      status: "completed",
      withdrawalNote: request.withdrawalNote,
      transactionId,
    });

    await this._repository.updateWalletBalance(
      wallet._id.toString(),
      -request.amount,
      transaction._id.toString(),
    );

    await this._withdrawalRequestRepository.updateRequestStatus(
      requestId,
      "approved",
      transaction._id.toString(),
    );

    return this.getWalletInfo(request.userId.toString());
  }

  async rejectWithdrawal(requestId: string): Promise<void> {
    const request = await this._withdrawalRequestRepository.findById(requestId);
    if (!request) {
      throw new CustomError(WALLET_MESSAGES.WITHDRAWAL_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    if (request.status !== "pending") {
      throw new CustomError(WALLET_MESSAGES.REQUEST_PROCESSED, StatusCodes.BAD_REQUEST);
    }

    if ((request.nexusPoints ?? 0) > 0) {
      const wallet = await this._repository.getWalletByUserId(request.userId.toString());
      if (wallet) {
        await this._repository.update(wallet._id, {
          nexusPoints: wallet.nexusPoints + (request.nexusPoints ?? 0),
        });

        await this._nexusPointRepository.addPointsTransaction({
          userId: request.userId,
          points: request.nexusPoints,
          type: "earned",
          description: `Restored ${request.nexusPoints} nexus points due to rejected withdrawal`,
        });
      }
    }

    await this._withdrawalRequestRepository.updateRequestStatus(requestId, "rejected");
  }

  async addNexusPoints(userId: string, points: number, description: string): Promise<WalletInfo> {
    let wallet = await this._repository.getWalletByUserId(userId);
    if (!wallet) {
      wallet = await this._repository.create({
        userId,
        balance: 0,
        nexusPoints: 0,
        transactions: [],
      });
    }

    await this._nexusPointRepository.addPointsTransaction({
      userId,
      points,
      type: "earned",
      description,
    });

    await this._repository.update(wallet._id, {
      nexusPoints: wallet.nexusPoints + points,
    });

    return this.getWalletInfo(userId);
  }

  async getWalletInfo(userId: string, status?: "pending" | "completed"): Promise<WalletInfo> {
    const wallet = await this._repository.getWalletByUserId(userId);
    const transactions = await this._repository.getTransactionsByUserId(userId, status);
    const pointTransactions = await this._nexusPointRepository.getPointsByUserId(userId);

    return {
      balance: wallet?.balance || 0,
      nexusPoints: wallet?.nexusPoints || 0,
      transactions,
      pointTransactions: pointTransactions.map(pt => ({
        _id: pt._id.toString(),
        points: pt.points,
        type: pt.type,
        description: pt.description,
        createdAt: pt.createdAt,
      })),
    };
  }
}
