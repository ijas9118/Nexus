import { ISubscription } from '@/models/subscription.model';

export interface ISubscriptionService {
  getUserSubscription(userId: string): Promise<ISubscription | null>;
}
