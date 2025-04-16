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
