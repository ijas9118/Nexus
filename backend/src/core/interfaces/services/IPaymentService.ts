import { IPlan } from '../../../models/plan.model';

export interface IPaymentService {
  checkoutSession(
    planId: string,
    tier: string,
    price: number,
    customerId: string,
    email: string
  ): Promise<string>;
  webhookHandler(bodyData: any, signature: string): Promise<void>;
}
