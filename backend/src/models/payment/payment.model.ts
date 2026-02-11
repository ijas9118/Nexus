import type { Document } from "mongoose";

import mongoose, { Schema } from "mongoose";

interface IPayment extends Document<string> {
  userId: mongoose.Types.ObjectId | string;
  planId: mongoose.Types.ObjectId | string;
  stripeSessionId: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  customerEmail: string;
  customerName: string;
  tier: string;
}

const PaymentSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
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
    tier: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);
export { IPayment, PaymentModel };
