import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  type: 'incoming' | 'withdrawal';
  bookingId?: mongoose.Types.ObjectId;
  date: Date;
  amount: number;
  status: 'pending' | 'completed';
  userId: mongoose.Types.ObjectId;
  menteeId?: mongoose.Types.ObjectId;
  withdrawalNote?: string;
}

const TransactionSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ['incoming', 'withdrawal'],
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
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
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    menteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    withdrawalNote: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const TransactionModel = mongoose.model<ITransaction>('Transaction', TransactionSchema);
