import { UserInterface } from "./user";

export interface Mentor {
  _id: string;
  userId: {
    name: string;
    profilePic: string;
  };
  experience: {
    currentRole: string;
    expertiseAreas: string[];
    bio: string;
  };
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
