import type { Buffer } from 'node:buffer';
import type Stripe from 'stripe';

import { inject, injectable } from 'inversify';

import type { IPaymentRepository } from '@/core/interfaces/repositories/i-payment-repository';
import type { ISubscriptionRepository } from '@/core/interfaces/repositories/i-subscription-repository';
import type { IUserRepository } from '@/core/interfaces/repositories/i-user-repository';
import type { IBookingPaymentService } from '@/core/interfaces/services/i-booking-payment-service';

import logger from '@/config/logger';
import { TYPES } from '@/di/types';

import type { IPaymentService } from '../core/interfaces/services/i-payment-service';

import { stripe } from '../config/stripe.cofig';
import { env } from '../utils/env-validation';

@injectable()
export class PaymentServce implements IPaymentService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.PaymentRepository) private paymentRepository: IPaymentRepository,
    @inject(TYPES.SubscriptionRepository) private subscriptionRepository: ISubscriptionRepository,
    @inject(TYPES.BookingPaymentService) private bookingPaymentService: IBookingPaymentService
  ) {}

  checkoutSession = async (
    planId: string,
    tier: string,
    price: number,
    customerId: string,
    email: string
  ): Promise<string> => {
    const currentSubscription =
      await this.subscriptionRepository.getUserCurrentSubscription(customerId);
    if (
      currentSubscription &&
      typeof currentSubscription.planId !== 'string' &&
      currentSubscription.planId._id.toString() === planId
    ) {
      throw new Error('User is already subscribed to this plan with an active subscription.');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: { name: tier },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${env.CLIENT_URL}/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.CLIENT_URL}/payment?canceled=true`,
      metadata: {
        planId,
        customerId,
        tier,
        type: 'subscription',
      },
    });

    return session.url as string;
  };

  webhookHandler = async (bodyData: Buffer, signature: string): Promise<void> => {
    const event: Stripe.Event = stripe.webhooks.constructEvent(
      bodyData,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;

        if (metadata?.type === 'booking') {
          await this.bookingPaymentService.webhookHandler(bodyData, signature);
        } else if (metadata?.type === 'subscription') {
          await this.handleCheckoutSessionCompleted(session);
        } else {
          logger.error('Unknown checkout session type');
        }
        break;
      }
      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }
  };

  async verifyCheckoutSession(sessionId: string): Promise<boolean> {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check for completed status
    return session.payment_status === 'paid' && session.status === 'complete';
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const {
      metadata,
      amount_total,
      currency,
      payment_intent,
      payment_status,
      customer_details,
      id,
    } = session;

    if (
      !metadata?.planId ||
      !metadata?.customerId ||
      !metadata?.tier ||
      !amount_total ||
      !currency ||
      !payment_intent ||
      !customer_details?.email ||
      !customer_details?.name
    ) {
      throw new Error('Missing required metadata or session details');
    }

    const payment = await this.paymentRepository.createPayment({
      userId: metadata.customerId,
      planId: metadata.planId,
      stripeSessionId: id,
      paymentIntentId: payment_intent as string,
      amount: amount_total / 100, // Convert from cents to INR
      currency,
      paymentStatus: payment_status,
      customerEmail: customer_details.email,
      customerName: customer_details.name,
      tier: metadata.tier,
    });

    const startDate = new Date();
    const endDate = new Date(startDate);

    endDate.setMonth(endDate.getMonth() + 1);

    await this.subscriptionRepository.createSubscription({
      userId: metadata.customerId,
      planId: metadata.planId,
      paymentId: payment._id as string,
      tier: metadata.tier,
      status: 'active',
      startDate,
      endDate,
      interval: 'month',
    });

    const user = await this.userRepository.updatePremiumStatus(metadata.customerId, true);
    if (!user) {
      throw new Error('User not found');
    }
  }
}
