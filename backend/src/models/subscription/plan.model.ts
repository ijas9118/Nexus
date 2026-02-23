import type { Document } from "mongoose";

import mongoose, { Schema } from "mongoose";

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
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    interval: {
      type: String,
      required: true,
      trim: true,
    },
    durationInDays: {
      type: Number,
      min: 1,
    },
    ctaText: {
      type: String,
      required: true,
      trim: true,
    },
    highlights: {
      type: [String],
      required: true,
      validate: {
        validator: (highlights: string[]) => highlights.length > 0,
        message: "At least one highlight is required",
      },
      set: (highlights: string[]) => highlights.map(h => h.trim()).filter(Boolean),
    },
    logo: {
      type: String,
      required: true,
      trim: true,
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
  },
);

const PlanModel = mongoose.model<IPlan>("Plan", PlanSchema);
export { IPlan, PlanModel };
