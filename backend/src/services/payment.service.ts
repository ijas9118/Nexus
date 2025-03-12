import { injectable } from 'inversify';
import { IPaymentService } from '../core/interfaces/services/IPaymentService';
import { stripe } from '../config/stripe.cofig';
import { CLIENT_URL } from '../utils/constants';
import { IPlan } from '../models/plan.model';

@injectable()
export class PaymentServce implements IPaymentService {
  checkoutSession = async (plan: IPlan, priceId: string, customerId: string): Promise<string> => {
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: priceId,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${CLIENT_URL}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}?canceled=true`,
    });

    return session.url as string;
  };
}
