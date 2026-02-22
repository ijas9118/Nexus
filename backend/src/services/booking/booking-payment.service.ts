import type { Buffer } from "node:buffer";
import type Stripe from "stripe";

import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import { v4 as uuidv4 } from "uuid";

import type { IBookingPaymentRepository } from "@/core/interfaces/repositories/i-booking-payment-repository";
import type { IBookingRepository } from "@/core/interfaces/repositories/i-booking-repository";
import type { IMentorRepository } from "@/core/interfaces/repositories/i-mentor-repository";
import type { IBookingPaymentService } from "@/core/interfaces/services/i-booking-payment-service";
import type { INotificationService } from "@/core/interfaces/services/i-notification-service";
import type { ITimeSlotService } from "@/core/interfaces/services/i-time-slot-service";
import type { IWalletService } from "@/core/interfaces/services/i-wallet-service";
import type { MentorshipTypeRepository } from "@/repositories/mentor/mentorship-type.repository";

import logger from "@/config/logger";
import { stripe } from "@/config/stripe.cofig";
import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";
import { env } from "@/utils/env-validation";

const { BOOKING_MESSAGES, MENTOR_MESSAGES, AUTH_MESSAGES } = MESSAGES;

@injectable()
export class BookingPaymentService implements IBookingPaymentService {
  constructor(
    @inject(TYPES.BookingRepository) private bookingRepository: IBookingRepository,
    @inject(TYPES.BookingPaymentRepository)
    private bookingPaymentRepository: IBookingPaymentRepository,
    @inject(TYPES.MentorshipTypeRepository)
    private mentorshipTypeRepository: MentorshipTypeRepository,
    @inject(TYPES.NotificationService) private notificationService: INotificationService,
    @inject(TYPES.MentorRepository) private mentorRepository: IMentorRepository,
    @inject(TYPES.TimeSlotService) private timeSlotService: ITimeSlotService,
    @inject(TYPES.WalletService) private walletService: IWalletService,
  ) {}

  async checkoutSession(
    mentorId: string,
    mentorshipType: string,
    mentorUserId: string,
    date: string,
    timeSlot: string,
    reason: string,
    customerId: string,
    email: string,
  ): Promise<string> {
    const isAvailable = await this.timeSlotService.isTimeSlotAvailable(timeSlot, mentorId);
    if (!isAvailable) {
      throw new CustomError(BOOKING_MESSAGES.SLOT_NOT_AVAILABLE, StatusCodes.BAD_REQUEST);
    }

    const reserved = await this.timeSlotService.reserveTimeSlot(timeSlot, mentorId, 10);
    if (!reserved) {
      throw new CustomError(BOOKING_MESSAGES.RESERVE_FAILED, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    const mentorship = await this.mentorshipTypeRepository.findById(mentorshipType);
    if (!mentorship) {
      throw new CustomError(MENTOR_MESSAGES.TYPE_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const booking = await this.bookingRepository.createBooking({
      userId: customerId,
      mentorId,
      mentorUserId,
      mentorshipType,
      timeSlot,
      bookingDate: new Date(date),
      reason,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: mentorship.name },
            unit_amount: (mentorship.defaultPrice + 20) * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${env.CLIENT_URL}/booking?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.CLIENT_URL}/booking?canceled=true`,
      metadata: {
        bookingId: booking._id.toString(),
        mentorId,
        mentorshipType,
        mentorshipTypeName: mentorship.name,
        customerId,
        timeSlot,
        type: "booking",
      },
    });

    return session.url as string;
  }

  async webhookHandler(bodyData: Buffer, signature: string): Promise<void> {
    const event: Stripe.Event = stripe.webhooks.constructEvent(
      bodyData,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        await this.handleCheckoutSessionCompleted(session);
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object;
        if (
          session.metadata?.bookingId
          && session.metadata?.timeSlot
          && session.metadata?.mentorId
        ) {
          await this.bookingRepository.updateOne(
            { _id: session.metadata.bookingId },
            { status: "cancelled" },
          );
          await this.timeSlotService.update(session.metadata.timeSlot, {
            status: "available",
            reservedUntil: undefined,
          });
        }
        break;
      }
      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }
  }

  async verifyCheckoutSession(sessionId: string): Promise<boolean> {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.payment_status === "paid" && session.status === "complete";
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
      !metadata?.bookingId
      || !metadata?.mentorId
      || !metadata?.mentorshipType
      || !metadata?.customerId
      || !metadata?.timeSlot
      || !amount_total
      || !currency
      || !metadata.mentorshipTypeName
      || !payment_intent
      || !customer_details?.email
      || !customer_details?.name
    ) {
      throw new CustomError(BOOKING_MESSAGES.MISSING_SESSION_DETAILS, StatusCodes.BAD_REQUEST);
    }

    const timeSlot = await this.timeSlotService.findById(metadata.timeSlot);
    if (
      !timeSlot
      || timeSlot.mentorId.toString() !== metadata.mentorId
      || timeSlot.status !== "reserved"
    ) {
      logger.error(
        `Time slot ${metadata.timeSlot} is not reserved for booking ${metadata.bookingId}`,
      );
      await this.bookingRepository.updateOne({ _id: metadata.bookingId }, { status: "cancelled" });
      throw new CustomError(BOOKING_MESSAGES.SLOT_EXPIRED, StatusCodes.GONE);
    }

    await this.bookingRepository.updateOne({ _id: metadata?.bookingId }, { status: "pending" });

    await this.timeSlotService.bookTimeSlot(metadata.timeSlot, metadata.mentorId);

    await this.bookingPaymentRepository.createBookingPayment({
      userId: metadata.customerId,
      bookingId: metadata.bookingId,
      mentorId: metadata.mentorId,
      mentorshipType: metadata.mentorshipType,
      stripeSessionId: id,
      paymentIntentId: payment_intent as string,
      amount: amount_total / 100,
      currency,
      paymentStatus: payment_status as any,
      customerEmail: customer_details.email,
      customerName: customer_details.name,
    });

    const mentor = await this.mentorRepository.findById(metadata.mentorId);
    if (!mentor) {
      throw new CustomError(AUTH_MESSAGES.MENTOR_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    await this.walletService.addMoney(
      mentor.userId.toString(), // Mentor's user ID
      amount_total / 100 - 20,
      metadata.bookingId,
      metadata.customerId, // Mentee ID
    );

    const meetToken = uuidv4();
    const meetUrl = `${env.CLIENT_URL}/meeting/${meetToken}`;

    await this.bookingRepository.update(metadata.bookingId, { meetUrl });

    const notificationTypeId
      = await this.notificationService.getNotificationTypeIdByName("New Booking Request");

    await this.notificationService.createForUser(
      notificationTypeId,
      mentor.userId.toString(),
      "New Booking Confirmed",
      `A new mentorship session has been booked by ${customer_details.name} for ${metadata.mentorshipTypeName}. Please check your schedule and prepare for the session.`,
    );
  }
}
