import type { Document } from "mongoose";

import mongoose, { Schema } from "mongoose";

export interface IWallet extends Document<string> {
  userId: mongoose.Types.ObjectId | string;
  balance: number;
  nexusPoints: number;
  transactions: mongoose.Types.ObjectId[];
}

const WalletSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    nexusPoints: {
      type: Number,
      required: true,
      default: 0,
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const WalletModel = mongoose.model<IWallet>("Wallet", WalletSchema);
