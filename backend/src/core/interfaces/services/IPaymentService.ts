import { IPlan } from '../../../models/plan.model';

export interface IPaymentService {
  checkoutSession(plan: IPlan, priceId: string, customerId: string): Promise<string>;
  webhookHandler(bodyData: any, signature: string): Promise<void>;
}
