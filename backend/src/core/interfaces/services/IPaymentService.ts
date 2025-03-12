import { IPlan } from '../../../models/plan.model';

export interface IPaymentService {
  checkoutSession(plan: IPlan, priceId: string, customerId: string): Promise<string>;
}
