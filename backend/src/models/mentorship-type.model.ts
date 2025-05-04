import mongoose, { Schema, Document } from 'mongoose';

export interface IMentorshipType extends Document {
  name: string;
  description: string;
  isActive: boolean;
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
  },
  {
    timestamps: true,
  }
);

export const MentorshipTypeModel = mongoose.model<IMentorshipType>(
  'MentorshipType',
  MentorshipTypeSchema
);
