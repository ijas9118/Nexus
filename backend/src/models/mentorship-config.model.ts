import mongoose, { Document, Schema } from 'mongoose';

export interface IMentorshipConfig extends Document {
  category:
    | 'mentorshipType'
    | 'targetAudience'
    | 'expertiseArea'
    | 'technology'
    | 'experienceLevel';
  value: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MentorshipConfigSchema: Schema = new Schema(
  {
    category: {
      type: String,
      enum: ['mentorshipType', 'targetAudience', 'expertiseArea', 'technology', 'experienceLevel'],
      required: true,
    },
    value: {
      type: String,
      required: true,
      unique: true,
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

export const MentorshipConfigModel = mongoose.model<IMentorshipConfig>(
  'MentorshipConfig',
  MentorshipConfigSchema
);
