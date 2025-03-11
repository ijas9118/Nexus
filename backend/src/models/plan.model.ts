import mongoose, { Document, Schema } from 'mongoose';

export interface IPlan extends Document {
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  activeSubscribers: number;
  revenue: number;
  conversionRate: number;
}

const PlanSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    interval: {
      type: String,
      enum: ['monthly', 'yearly'],
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    activeSubscribers: {
      type: Number,
      default: 0,
    },
    revenue: {
      type: Number,
      default: 0,
    },
    conversionRate: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const PlanModel = mongoose.model<IPlan>('Plan', PlanSchema);
export default PlanModel;
