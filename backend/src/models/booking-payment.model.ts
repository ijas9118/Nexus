import type { Document } from "mongoose";

import mongoose, { Schema } from "mongoose";

interface IBookingPayment extends Document<string> {
  userId: mongoose.Types.ObjectId | string;
  bookingId: mongoose.Types.ObjectId | string;
  mentorId: mongoose.Types.ObjectId | string;
  mentorshipType: mongoose.Types.ObjectId | string;
  stripeSessionId: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  customerEmail: string;
  customerName: string;
}

const BookingPaymentSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    mentorshipType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MentorshipType",
      required: true,
    },
    stripeSessionId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["paid", "unpaid", "failed"],
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const BookingPaymentModel = mongoose.model<IBookingPayment>("BookingPayment", BookingPaymentSchema);
export { BookingPaymentModel, IBookingPayment };
