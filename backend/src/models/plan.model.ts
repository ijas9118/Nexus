import mongoose, { Schema, Document } from 'mongoose';

interface IPlan extends Document {
  tier: string;
  description: string;
  price: number;
  interval: string;
  ctaText: string;
  highlights: string[];
  logo: string;
  featured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const PlanScheme = new Schema<IPlan>(
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
const PlanModel = mongoose.model<IPlan>('Plan', PlanScheme);
export { IPlan, PlanModel };
