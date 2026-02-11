import { injectable } from "inversify";
import mongoose from "mongoose";

import type { IWalletRepository } from "@/core/interfaces/repositories/i-wallet-repository";
import type { TransactionDetails } from "@/core/types/wallet.types";
import type { ITransaction } from "@/models/payment/transaction.model";
import type { IWallet } from "@/models/payment/wallet.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { TransactionModel } from "@/models/payment/transaction.model";
import { WalletModel } from "@/models/payment/wallet.model";

@injectable()
export class WalletRepository extends BaseRepository<IWallet> implements IWalletRepository {
  constructor() {
    super(WalletModel);
  }

  async getWalletByUserId(userId: string): Promise<IWallet | null> {
    return this.findOne({ userId });
  }

  async updateWalletBalance(
    walletId: string,
    amount: number,
    transactionId: string,
  ): Promise<IWallet | null> {
    const wallet = await this.findById(walletId);
    if (!wallet)
      throw new Error("Wallet not found");

    wallet.balance += amount;
    wallet.transactions.push(new mongoose.Types.ObjectId(transactionId));
    return await this.update(walletId, wallet);
  }

  async addTransaction(transaction: Partial<ITransaction>): Promise<ITransaction> {
    const newTransaction = new TransactionModel(transaction);
    return await newTransaction.save();
  }

  async getTransactionsByUserId(
    userId: string,
    status?: "pending" | "completed",
  ): Promise<TransactionDetails[]> {
    const query: any = { userId };
    if (status)
      query.status = status;

    const transactions = await TransactionModel.find(query)
      .populate("menteeId", "name profilePic")
      .exec();

    return transactions.map(t => ({
      _id: t._id.toString(),
      transactionId: t.transactionId,
      type: t.type,
      date: t.date,
      amount: t.amount,
      status: t.status,
      details: {
        name: t.menteeId ? (t.menteeId as any).name : undefined,
        profilePic: t.menteeId ? (t.menteeId as any).profilePic : undefined,
        withdrawalNote: t.withdrawalNote,
      },
    }));
  }
}
