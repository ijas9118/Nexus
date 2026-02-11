import type { Document } from "mongoose";

import mongoose, { Schema } from "mongoose";

export interface ITransaction extends Document<string> {
  transactionId: string;
  type: "incoming" | "withdrawal";
  bookingId?: string;
  date: Date;
  amount: number;
  status: "pending" | "completed" | "rejected";
  userId: string;
  menteeId?: string;
  withdrawalNote?: string;
}

const TransactionSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ["incoming", "withdrawal"],
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    transactionId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "rejected"],
      default: "pending",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    menteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    withdrawalNote: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const TransactionModel = mongoose.model<ITransaction>("Transaction", TransactionSchema);
