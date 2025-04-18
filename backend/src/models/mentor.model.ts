import { MentorStatus } from '@/core/types';
import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IMentor extends Document {
  userId: ObjectId;
  experience: {
    currentRole: string;
    company: string;
    experienceLevel: ObjectId;
    expertiseAreas: ObjectId[];
    technologies: ObjectId[];
    bio: string;
    resume?: string | null;
  };
  mentorshipDetails: {
    mentorshipTypes: ObjectId[];
    targetAudiences: ObjectId[];
    availabilityType: 'weekdays' | 'weekend' | 'both';
    availableTimeSlots: string[];
    motivation: string;
  };
  status: MentorStatus;
  createdAt: Date;
  updatedAt: Date;
}

const MentorSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    experience: {
      currentRole: { type: String, required: true },
      company: { type: String, required: true },
      experienceLevel: {
        type: Schema.Types.ObjectId,
        ref: 'MentorshipConfig',
        required: true,
      },
      expertiseAreas: [
        {
          type: Schema.Types.ObjectId,
          ref: 'MentorshipConfig',
          required: true,
        },
      ],
      technologies: [
        {
          type: Schema.Types.ObjectId,
          ref: 'MentorshipConfig',
          required: true,
        },
      ],
      bio: { type: String, required: true },
      resume: { type: String, default: null },
    },
    mentorshipDetails: {
      mentorshipTypes: [
        {
          type: Schema.Types.ObjectId,
          ref: 'MentorshipConfig',
          default: [],
        },
      ],
      targetAudiences: [
        {
          type: Schema.Types.ObjectId,
          ref: 'MentorshipConfig',
          default: [],
        },
      ],
      availabilityType: {
        type: String,
        enum: ['weekdays', 'weekend', 'both'],
        default: 'both',
      },
      availableTimeSlots: { type: [String], required: true },
      motivation: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const MentorModel = mongoose.model<IMentor>('Mentor', MentorSchema);
