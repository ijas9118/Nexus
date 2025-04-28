import { BaseRepository } from '@/core/abstracts/base.repository';
import { ISubscriptionRepository } from '@/core/interfaces/services/ISubscriptionRepository';
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
}
