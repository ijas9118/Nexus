import { UserRole } from '@/core/types/global/user-role';
import { ObjectId } from 'mongoose';

export interface LoginResponseDto {
  _id: ObjectId;
  name: string;
  email: string;
  profilePic: string;
  gender: string;
  place: string;
  postsCount: number;
  totalViews: number;
  totalLikes: number;
  bio: string;
  joinedSquads: string[];
  streak: {
    current: number;
    longest: number;
    total: number;
  };
  skills: string[];
  socials: [{ platform: string; url: string }];
  role: UserRole;
  username?: string;
  mentorId?: string;
  isPremium: boolean;
  googleId?: string;
  githubId?: string;
}
