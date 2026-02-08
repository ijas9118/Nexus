import type { Document } from 'mongoose';

import mongoose, { Schema } from 'mongoose';

export interface IWithdrawalRequest extends Document<string> {
  userId: string;
  amount: number;
  nexusPoints?: number;
  withdrawalNote: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const WithdrawalRequestSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    nexusPoints: {
      type: Number,
      default: 0,
    },
    withdrawalNote: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const WithdrawalRequestModel = mongoose.model<IWithdrawalRequest>(
  'WithdrawalRequest',
  WithdrawalRequestSchema
);
