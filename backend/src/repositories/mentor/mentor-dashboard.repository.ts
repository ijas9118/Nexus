import { injectable } from "inversify";
import mongoose from "mongoose";

import type { IMentorDashboardRepository } from "@/core/interfaces/repositories/i-mentor-dashboard-repository";
import type {
  PendingWithdrawalsResponse,
  SessionStatsResponse,
} from "@/core/types/mentor-dashboard";

import { BookingModel } from "@/models/booking/booking.model";
import { TransactionModel } from "@/models/payment/transaction.model";
import { WalletModel } from "@/models/payment/wallet.model";
import { WithdrawalRequestModel } from "@/models/payment/withdrawal-request.model";

@injectable()
export class MentorDashboardRepository implements IMentorDashboardRepository {
  async getEarnings(userId: string): Promise<{ thisMonth: number; lastMonth: number }> {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // last day of previous month

    const [thisMonth, lastMonth] = await Promise.all([
      TransactionModel.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            type: "incoming",
            date: { $gte: startOfThisMonth },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
      TransactionModel.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            type: "incoming",
            date: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
    ]);

    return {
      thisMonth: thisMonth[0]?.total || 0,
      lastMonth: lastMonth[0]?.total || 0,
    };
  }

  async getPendingWithdrawalWithBalance(userId: string): Promise<PendingWithdrawalsResponse> {
    const [pendingResult, wallet] = await Promise.all([
      WithdrawalRequestModel.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            status: "pending",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
      WalletModel.findOne({ userId }).select("balance"),
    ]);

    return {
      pendingWithdrawal: pendingResult[0]?.total || 0,
      balance: wallet?.balance || 0,
    };
  }

  async getSessionStats(userId: string): Promise<SessionStatsResponse> {
    const [completed, upcoming, pending] = await Promise.all([
      BookingModel.countDocuments({
        mentorUserId: new mongoose.Types.ObjectId(userId),
        status: "completed",
      }),
      BookingModel.countDocuments({
        mentorUserId: new mongoose.Types.ObjectId(userId),
        status: "upcoming",
      }),
      BookingModel.countDocuments({
        mentorUserId: new mongoose.Types.ObjectId(userId),
        status: "pending",
      }),
    ]);
    return { completed, upcoming, pending };
  }

  async getRecentTransactions(userId: string) {
    return TransactionModel.find({ mentorId: userId }).sort({ createdAt: -1 }).limit(3);
  }

  async getMentorshipTypeStats(userId: string) {
    const stats = await BookingModel.aggregate([
      { $match: { mentorId: userId } },
      { $group: { _id: "$type", bookings: { $sum: 1 } } },
    ]);

    const total = stats.reduce((acc, s) => acc + s.bookings, 0);
    return stats.map(s => ({
      name: s._id,
      bookings: s.bookings,
      percentage: Math.round((s.bookings / total) * 100),
    }));
  }
}
