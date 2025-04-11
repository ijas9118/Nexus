import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IMentor extends Document {
  userId: ObjectId;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    profilePic?: string | null;
  };
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
  status: 'pending' | 'approved' | 'rejected';
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
    personalInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      location: { type: String, required: true },
      linkedin: { type: String },
      github: { type: String },
      profilePic: { type: String, default: null },
    },
    experience: {
      currentRole: { type: String, required: true },
      company: { type: String, required: true },
      experienceLevel: { type: String, required: true },
      expertiseAreas: { type: [String], required: true },
      technologies: { type: [String], required: true },
      bio: { type: String, required: true },
      resume: { type: String, default: null },
    },
    mentorshipDetails: {
      mentorshipTypes: [{ type: Schema.Types.ObjectId, ref: 'MentorshipConfig', default: [] }],
      targetAudiences: [{ type: Schema.Types.ObjectId, ref: 'MentorshipConfig', default: [] }],
      availabilityType: {
        type: String,
        enum: ['in-person', 'remote', 'both'],
        default: 'both',
      },
      availableTimeSlots: { type: [String], required: true },
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
