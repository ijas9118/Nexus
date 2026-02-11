import { injectable } from "inversify";

import type { ITransactionRepository } from "@/core/interfaces/repositories/i-transaction-repository";
import type { ITransaction } from "@/models/payment/transaction.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { TransactionModel } from "@/models/payment/transaction.model";

@injectable()
export class TransactionRepository
  extends BaseRepository<ITransaction>
  implements ITransactionRepository {
  constructor() {
    super(TransactionModel);
  }

  async getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<ITransaction[]> {
    return this.model
      .find({
        date: { $gte: startDate, $lte: endDate },
        status: "completed",
        type: "incoming",
      })
      .sort({ date: 1 })
      .lean();
  }

  async countTransactionsByDateRange(startDate: Date, endDate: Date): Promise<number> {
    return this.model.countDocuments({
      date: { $gte: startDate, $lte: endDate },
      status: "completed",
      type: "incoming",
    });
  }

  async getTransactionRevenueByDateGroups(
    startDate: Date,
    endDate: Date,
    groupByFormat: string,
  ): Promise<Array<{ date: string; revenue: number }>> {
    // Determine the date format for grouping based on the time range
    let dateFormat;
    switch (groupByFormat) {
      case "day":
        dateFormat = "%Y-%m-%d"; // Group by day
        break;
      case "week":
        dateFormat = "%Y-%U"; // Group by week
        break;
      case "month":
        dateFormat = "%Y-%m"; // Group by month
        break;
      default:
        dateFormat = "%Y-%m-%d"; // Default to day
    }

    const result = await this.model.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          status: "completed",
          type: "incoming",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$date" } },
          revenue: { $sum: { $multiply: ["$amount", 0.2] } }, // 20% platform fee
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          revenue: 1,
          count: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    return result;
  }
}
