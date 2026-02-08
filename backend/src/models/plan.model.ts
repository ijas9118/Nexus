import type { Document } from "mongoose";

import mongoose, { Schema } from "mongoose";

interface IPlan extends Document {
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
  },
);

PlanSchema.pre("save", function (next) {
  const plan = this as IPlan;
  const interval = plan.interval.toLowerCase().trim();

  // Parse interval (e.g., "month", "6 months", "12 months")
  const match = interval.match(/^(\d+)?\s*(month|months)$/);
  if (!match) {
    return next(new Error("Invalid interval format. Expected \"month\" or \"<number> months\""));
  }

  const numMonths = match[1] ? Number.parseInt(match[1], 10) : 1; // Default to 1 month if no number
  const daysPerMonth = 30; // Approximation (30 days per month for simplicity)
  plan.durationInDays = numMonths * daysPerMonth;

  next();
});

const PlanModel = mongoose.model<IPlan>("Plan", PlanSchema);
export { IPlan, PlanModel };
