import { inject, injectable } from 'inversify';
import { ISubscriptionRepository } from '@/core/interfaces/repositories/ISubscriptionRepository';
import { ISubscription } from '@/models/subscription.model';
import { TYPES } from '@/di/types';
import { ISubscriptionService } from '@/core/interfaces/services/ISubscriptionService';

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(TYPES.SubscriptionRepository) private subscriptionRepo: ISubscriptionRepository
  ) {}

  async getUserSubscription(userId: string): Promise<ISubscription | null> {
    return this.subscriptionRepo.getUserCurrentSubscription(userId);
  }
}
