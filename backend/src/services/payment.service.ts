import { injectable } from 'inversify';
import { IPaymentService } from '../core/interfaces/services/IPaymentService';
import { stripe } from '../config/stripe.cofig';
import { CLIENT_URL, STRIPE_WEBHOOK_SECRET } from '../utils/constants';
import { IPlan } from '../models/plan.model';
import Stripe from 'stripe';

@injectable()
export class PaymentServce implements IPaymentService {
  checkoutSession = async (plan: IPlan, priceId: string, customerId: string): Promise<string> => {
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${CLIENT_URL}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}?canceled=true`,
      metadata: {
        planId: plan._id as string,
        customerId,
      },
    });

    return session.url as string;
  };

  webhookHandler = async (bodyData: Buffer, signature: string): Promise<void> => {
    const event: Stripe.Event = stripe.webhooks.constructEvent(
      bodyData,
      signature,
      STRIPE_WEBHOOK_SECRET
    );

    console.log(event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout session completed:', session);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  };
}
