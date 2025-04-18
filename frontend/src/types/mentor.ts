import { UserInterface } from "./user";

export interface Mentor {
  _id: string;
  name: string;
  email: string;
  specialization: string[];
  status: string;
}

export interface MentorshipConfig {
  _id: string;
  category: ConfigCategory | string;
  value: string;
  isActive: boolean;
  createdAt: Date;
}

export type ConfigCategory =
  | "mentorshipType"
  | "targetAudience"
  | "expertiseArea"
  | "technology"
  | "experienceLevel";

export interface MentorFormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    profilePhoto: File | null;
  };
  experience: {
    currentRole: string;
    company: string;
    experienceLevel: string;
    expertiseAreas: string[];
    technologies: string[];
    bio: string;
    resume: File | null;
  };
  mentorshipDetails: {
    mentorshipTypes: string[];
    targetAudiences: string[];
    availabilityType: string;
    availableTimeSlots: string[];
    motivation: string;
  };
}

export interface MentorApplication {
  _id: string;
  userId: UserInterface;
  experience: {
    currentRole: string;
    company: string;
    experienceLevel: MentorshipConfig;
    expertiseAreas: MentorshipConfig[];
    technologies: MentorshipConfig[];
    bio: string;
    resume: string | null;
  };
  mentorshipDetails: {
    mentorshipTypes: MentorshipConfig[];
    targetAudiences: MentorshipConfig[];
    availabilityType: "weekdays" | "weekend" | "both";
    availableTimeSlots: string[];
    motivation: string;
  };
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}
