import type { Document } from "mongoose";

import mongoose, { Schema } from "mongoose";

interface ISubscription extends Document<string> {
  userId: mongoose.Types.ObjectId | string;
  planId: mongoose.Types.ObjectId | string;
  paymentId: mongoose.Types.ObjectId | string;
  tier: string;
  status: "active" | "cancelled" | "expired" | "past_due";
  startDate: Date;
  endDate: Date;
  interval: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema(
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
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    tier: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "cancelled", "expired", "past_due"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    interval: {
      type: String,
    },
    stripeSubscriptionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const SubscriptionModel = mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
export { ISubscription, SubscriptionModel };
