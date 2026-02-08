export interface IPaymentService {
  checkoutSession: (
    planId: string,
    tier: string,
    price: number,
    customerId: string,
    email: string
  ) => Promise<string>;
  webhookHandler: (bodyData: any, signature: string) => Promise<void>;

  verifyCheckoutSession: (sessionId: string) => Promise<boolean>;
}
