import { BaseRepository } from '@/core/abstracts/base.repository';
import { ISubscriptionRepository } from '@/core/interfaces/repositories/ISubscriptionRepository';
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
    return this.model.countDocuments({});
  }
}
