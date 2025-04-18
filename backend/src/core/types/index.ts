export type PersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  profilePic?: string | null;
};

export type MentorStatus = 'pending' | 'approved' | 'rejected';
