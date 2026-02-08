import type { Document } from "mongoose";

import mongoose, { Schema } from "mongoose";

export interface IMentorMetadata extends Document<string> {
  label: string;
  name: string;
  type: "experienceLevel" | "expertiseArea" | "technology";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MentorMetadataSchema: Schema = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["experienceLevel", "expertiseArea", "technology"],
      required: true,
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

// Indexes for performance
MentorMetadataSchema.index({ type: 1, name: 1 }, { unique: true });
MentorMetadataSchema.index({ type: 1, isActive: 1 });

export const MentorMetadataModel = mongoose.model<IMentorMetadata>(
  "MentorMetadata",
  MentorMetadataSchema,
);
