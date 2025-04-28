import { ISubscription } from '@/models/subscription.model';
import { IBaseRepository } from '../repositories/IBaseRepository';

export interface ISubscriptionRepository extends IBaseRepository<ISubscription> {
  createSubscription(data: Partial<ISubscription>): Promise<ISubscription>;
}
