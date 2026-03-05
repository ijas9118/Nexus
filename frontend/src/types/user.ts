export interface UserInterface {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: UserRoles;
  bio?: string;
  profilePic?: string;
  followers?: number;
  following?: number;
  connections?: number;
  joinedAt?: string;
  socials?: { platform: string; url: string }[];
  isPremium: boolean;
  location: string;
  phone: string;
  mentorId?: string;
  skills?: string[];
  postsCount?: number;
  totalLikes?: number;
  totalViews?: number;
  googleId?: string;
  githubId?: string;
}

export interface IUser {
  _id: string;
  name: string;
  username: string;
  profilePic: string;
}

export type UserRoles = "user" | "mentor" | "admin" | "premium";
