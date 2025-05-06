import { UserInterface } from "./user";

export interface Mentor {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    profilePic: string;
    username: string;
    location: string;
  };
  experience: {
    currentRole: string;
    company: string;
    bio: string;
    resume: string;
    experienceLevel: {
      _id: string;
      label: string;
      name: string;
      type: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
    expertiseAreas: ExpertiseArea[];
    technologies: Technology[];
  };
  mentorshipDetails: {
    mentorshipTypes: MentorshipType[];
    targetAudiences: TargetAudience[]; // If you have models for audiences, replace string with a dedicated type
    availabilityType: "weekdays" | "weekends" | "both"; // You can expand this based on actual options
    motivation: string;
  };
  status: "pending" | "approved" | "rejected"; // inferred from your data
  createdAt: string;
  updatedAt: string;
}

export interface ExpertiseArea {
  _id: string;
  label: string;
  name: string;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Technology {
  _id: string;
  label: string;
  name: string;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MentorshipType {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TargetAudience {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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
    motivation: string;
  };
}

export interface MentorApplication {
  _id: string;
  userId: UserInterface;
  experience: {
    currentRole: string;
    company: string;
    experienceLevel: string;
    expertiseAreas: string[];
    technologies: string[];
    bio: string;
    resume: string | null;
  };
  mentorshipDetails: {
    mentorshipTypes: string[];
    targetAudiences: string[];
    availabilityType: "weekdays" | "weekend" | "both";
    availableTimeSlots: string[];
    motivation: string;
  };
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export type AvailabilityType = "weekdays" | "weekend" | "both";

export interface TimeSlot {
  _id: string;
  mentorId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type MentorshipTypeData = {
  _id?: string;
  name: string;
  description: string;
  isActive: boolean;
};
