import type { Document } from "mongoose";

import mongoose, { Schema } from "mongoose";

export interface ITargetAudience extends Document {
  name: string;
  isActive: boolean;
}

const TargetAudienceSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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

export const TargetAudienceModel = mongoose.model<ITargetAudience>(
  "TargetAudience",
  TargetAudienceSchema,
);
