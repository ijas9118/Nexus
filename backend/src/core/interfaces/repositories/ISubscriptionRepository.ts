import { ISubscription } from '@/models/subscription.model';
import { IBaseRepository } from './IBaseRepository';

export interface ISubscriptionRepository extends IBaseRepository<ISubscription> {
  createSubscription(data: Partial<ISubscription>): Promise<ISubscription>;
  getUserCurrentSubscription(userId: string): Promise<ISubscription | null>;
  countSubscription(): Promise<number>;
}
