export interface Mentor {
  _id: string;
  name: string;
  email: string;
  specialization: string[];
  status: string;
}

export interface MentorshipConfig {
  _id: string;
  category: string;
  value: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
