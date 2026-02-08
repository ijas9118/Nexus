import type { Document } from 'mongoose';

import mongoose, { Schema } from 'mongoose';

interface IPlan extends Document<string> {
  tier: string;
  description: string;
  price: number;
  interval: string;
  durationInDays: number;
  ctaText: string;
  highlights: string[];
  logo: string;
  featured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const PlanSchema = new Schema<IPlan>(
  {
    tier: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    interval: {
      type: String,
      required: true,
    },
    durationInDays: {
      type: Number,
    },
    ctaText: {
      type: String,
      required: true,
    },
    highlights: {
      type: [String],
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const PlanModel = mongoose.model<IPlan>('Plan', PlanSchema);
export { IPlan, PlanModel };
