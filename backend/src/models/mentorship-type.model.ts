import type { Document } from 'mongoose';

import mongoose, { Schema } from 'mongoose';

export interface IMentorshipType extends Document<string> {
  name: string;
  description: string;
  isActive: boolean;
  defaultPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const MentorshipTypeSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    defaultPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const MentorshipTypeModel = mongoose.model<IMentorshipType>(
  'MentorshipType',
  MentorshipTypeSchema
);
