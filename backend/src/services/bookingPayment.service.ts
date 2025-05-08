import { inject, injectable } from 'inversify';
import { stripe } from '@/config/stripe.cofig';
import { CLIENT_URL, STRIPE_WEBHOOK_SECRET } from '@/utils/constants';
import Stripe from 'stripe';
import { IBookingRepository } from '@/core/interfaces/repositories/IBookingRepository';
import { IBookingPaymentRepository } from '@/core/interfaces/repositories/IBookingPaymentRepository';
import { TYPES } from '@/di/types';
import { MentorshipTypeRepository } from '@/repositories/mentorship-type.repository';
import { IBookingPaymentService } from '@/core/interfaces/services/IBookingPaymentService';
import { v4 as uuidv4 } from 'uuid';
import { INotificationService } from '@/core/interfaces/services/INotificationService';

@injectable()
export class BookingPaymentService implements IBookingPaymentService {
  constructor(
    @inject(TYPES.BookingRepository) private bookingRepository: IBookingRepository,
    @inject(TYPES.BookingPaymentRepository)
    private bookingPaymentRepository: IBookingPaymentRepository,
    @inject(TYPES.MentorshipTypeRepository)
    private mentorshipTypeRepository: MentorshipTypeRepository,
    @inject(TYPES.NotificationService)
    private notificationService: INotificationService
  ) {}

  async checkoutSession(
    mentorId: string,
    mentorshipType: string,
    date: string,
    timeSlot: string,
    reason: string,
    customerId: string,
    email: string
  ): Promise<string> {
    const mentorship = await this.mentorshipTypeRepository.findById(mentorshipType);
    if (!mentorship) {
      throw new Error('Mentorship type not found');
    }

    const booking = await this.bookingRepository.createBooking({
      userId: customerId,
      mentorId,
      mentorshipType,
      timeSlot,
      bookingDate: new Date(date),
      reason,
      status: 'pending',
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: { name: mentorship.name },
            unit_amount: mentorship.defaultPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${CLIENT_URL}/booking?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/booking?canceled=true`,
      metadata: {
        bookingId: booking._id.toString(),
        mentorId,
        mentorshipType,
        customerId,
        type: 'booking',
      },
    });

    return session.url as string;
  }

  async webhookHandler(bodyData: Buffer, signature: string): Promise<void> {
    const event: Stripe.Event = stripe.webhooks.constructEvent(
      bodyData,
      signature,
      STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await this.handleCheckoutSessionCompleted(session);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  async verifyCheckoutSession(sessionId: string): Promise<boolean> {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
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
      !metadata?.bookingId ||
      !metadata?.mentorId ||
      !metadata?.mentorshipType ||
      !metadata?.customerId ||
      !amount_total ||
      !currency ||
      !payment_intent ||
      !customer_details?.email ||
      !customer_details?.name
    ) {
      throw new Error('Missing required metadata or session details');
    }

    await this.bookingPaymentRepository.createBookingPayment({
      userId: metadata.customerId,
      bookingId: metadata.bookingId,
      mentorId: metadata.mentorId,
      mentorshipType: metadata.mentorshipType,
      stripeSessionId: id,
      paymentIntentId: payment_intent as string,
      amount: amount_total / 100,
      currency,
      paymentStatus: payment_status,
      customerEmail: customer_details.email,
      customerName: customer_details.name,
    });

    const meetToken = uuidv4();
    const meetUrl = `${CLIENT_URL}/meeting/${meetToken}`;

    await this.bookingRepository.update(metadata.bookingId, { meetUrl });

    const notificationTypeId =
      await this.notificationService.getNotificationTypeIdByName('New Booking Request');

    await this.notificationService.createForUser(
      notificationTypeId,
      metadata.mentorId,
      'New Booking Confirmed',
      `A new mentorship session has been booked by ${customer_details.name} for ${metadata.mentorshipType}. Please check your schedule and prepare for the session.`
    );
  }
}
