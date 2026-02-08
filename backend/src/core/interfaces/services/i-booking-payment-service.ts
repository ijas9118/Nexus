import type { Buffer } from "node:buffer";

export interface IBookingPaymentService {
  checkoutSession: (
    mentorId: string,
    mentorshipType: string,
    mentorUserId: string,
    date: string,
    timeSlot: string,
    reason: string,
    customerId: string,
    email: string,
  ) => Promise<string>;
  webhookHandler: (bodyData: Buffer, signature: string) => Promise<void>;
  verifyCheckoutSession: (sessionId: string) => Promise<boolean>;
}
