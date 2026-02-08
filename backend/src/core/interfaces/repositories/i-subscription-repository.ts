import type { ISubscription } from '@/models/subscription.model';

import type { IBaseRepository } from './i-base-repository';

export interface ISubscriptionRepository extends IBaseRepository<ISubscription> {
  createSubscription: (data: Partial<ISubscription>) => Promise<ISubscription>;
  getUserCurrentSubscription: (userId: string) => Promise<ISubscription | null>;
  countSubscription: () => Promise<number>;
  countSubscriptionBefore: (date: Date) => Promise<number>;
  getSubscriptionStats: () => Promise<{
    totalRevenue: number;
    totalSubscriptions: number;
    planStats: Array<{
      tier: string;
      count: number;
      revenue: number;
    }>;
  }>;
  getSubscriptionRevenueByDateGroups: (
    startDate: Date,
    endDate: Date,
    groupByFormat: string
  ) => Promise<Array<{ date: string; revenue: number }>>;
}
