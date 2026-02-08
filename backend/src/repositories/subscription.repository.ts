import { injectable } from "inversify";

import type { ISubscriptionRepository } from "@/core/interfaces/repositories/i-subscription-repository";
import type { ISubscription } from "@/models/subscription.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { PlanModel } from "@/models/plan.model";
import { SubscriptionModel } from "@/models/subscription.model";

@injectable()
export class SubscriptionRepository
  extends BaseRepository<ISubscription>
  implements ISubscriptionRepository {
  constructor() {
    super(SubscriptionModel);
  }

  async createSubscription(data: Partial<ISubscription>): Promise<ISubscription> {
    return this.create(data);
  }

  async getUserCurrentSubscription(userId: string): Promise<ISubscription | null> {
    return this.model
      .findOne({ userId, status: { $in: ["active"] } })
      .populate("planId")
      .sort({ createdAt: -1 })
      .exec();
  }

  async countSubscription(): Promise<number> {
    return this.model.countDocuments({
      status: "active",
    });
  }

  async countSubscriptionBefore(date: Date): Promise<number> {
    return this.model.countDocuments({
      status: "active",
      createdAt: { $lt: date },
    });
  }

  async getSubscriptionStats(): Promise<{
    totalRevenue: number;
    totalSubscriptions: number;
    planStats: Array<{
      tier: string;
      count: number;
      revenue: number;
    }>;
  }> {
    // Get all active subscriptions with plan details
    const subscriptions = await this.model.find({ status: "active" }).populate("planId").lean();

    // Initialize result object
    const result = {
      totalRevenue: 0,
      totalSubscriptions: subscriptions.length,
      planStats: [] as Array<{
        tier: string;
        count: number;
        revenue: number;
      }>,
    };

    // Get all plans to ensure we include plans with zero subscriptions
    const allPlans = await PlanModel.find().lean();

    // Initialize plan stats with zero counts
    const planStatsMap = new Map<
      string,
      {
        tier: string;
        count: number;
        revenue: number;
      }
    >();

    // Initialize with all plans (even those with zero subscriptions)
    allPlans.forEach((plan) => {
      planStatsMap.set(plan.tier, {
        tier: plan.tier,
        count: 0,
        revenue: 0,
      });
    });

    // Calculate stats for each subscription
    subscriptions.forEach((subscription) => {
      const plan = subscription.planId as any; // Type assertion for populated field
      if (!plan)
        return; // Skip if plan not found

      const planPrice = plan.price || 0;
      result.totalRevenue += planPrice;

      // Update plan stats
      const planStats = planStatsMap.get(plan.tier) || {
        tier: plan.tier,
        count: 0,
        revenue: 0,
      };

      planStats.count++;
      planStats.revenue += planPrice;
      planStatsMap.set(plan.tier, planStats);
    });

    // Convert map to array
    result.planStats = Array.from(planStatsMap.values());

    return result;
  }

  async getSubscriptionRevenueByDateGroups(
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
          startDate: { $gte: startDate, $lte: endDate },
          status: "active",
        },
      },
      {
        $lookup: {
          from: "plans",
          localField: "planId",
          foreignField: "_id",
          as: "plan",
        },
      },
      {
        $unwind: "$plan",
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$startDate" } },
          revenue: { $sum: "$plan.price" },
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
