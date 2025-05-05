import {
  ExperienceLevel,
  ExpertiseArea,
  MentorStatus,
  TargetAudience,
  Technology,
} from '@/core/types/entities/mentor';
import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IMentor extends Document {
  userId: ObjectId;
  experience: {
    currentRole: string;
    company: string;
    experienceLevel: ExperienceLevel;
    expertiseAreas: ExpertiseArea[];
    technologies: Technology[];
    bio: string;
    resume?: string | null;
  };
  mentorshipDetails: {
    mentorshipTypes: ObjectId[];
    targetAudiences: TargetAudience[];
    availabilityType: 'weekdays' | 'weekend' | 'both';
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
        type: String,
        enum: Object.values(ExperienceLevel),
        required: true,
      },
      expertiseAreas: [
        {
          type: String,
          enum: Object.values(ExpertiseArea),
          required: true,
        },
      ],
      technologies: [
        {
          type: String,
          enum: Object.values(Technology),
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
          ref: 'MentorshipType',
          required: true,
        },
      ],
      targetAudiences: [
        {
          type: String,
          enum: Object.values(TargetAudience),
          required: true,
        },
      ],
      availabilityType: {
        type: String,
        enum: ['weekdays', 'weekend', 'both'],
        default: 'both',
      },
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
