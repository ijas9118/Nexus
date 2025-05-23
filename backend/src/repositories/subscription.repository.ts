import { BaseRepository } from '@/core/abstracts/base.repository';
import { ISubscriptionRepository } from '@/core/interfaces/repositories/ISubscriptionRepository';
import { PlanModel } from '@/models/plan.model';
import { ISubscription, SubscriptionModel } from '@/models/subscription.model';
import { injectable } from 'inversify';

@injectable()
export class SubscriptionRepository
  extends BaseRepository<ISubscription>
  implements ISubscriptionRepository
{
  constructor() {
    super(SubscriptionModel);
  }

  async createSubscription(data: Partial<ISubscription>): Promise<ISubscription> {
    return this.create(data);
  }

  async getUserCurrentSubscription(userId: string): Promise<ISubscription | null> {
    return this.model
      .findOne({ userId, status: { $in: ['active'] } })
      .populate('planId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async countSubscription(): Promise<number> {
    return this.model.countDocuments({
      status: 'active',
    });
  }

  async countSubscriptionBefore(date: Date): Promise<number> {
    return this.model.countDocuments({
      status: 'active',
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
    const subscriptions = await this.model.find({ status: 'active' }).populate('planId').lean();

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
      if (!plan) return; // Skip if plan not found

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
}
