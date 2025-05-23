import { UserRole } from '@/core/types/UserTypes';
import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document<string> {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  password: string;
  profilePic: string;
  profilePicPublicId?: string;
  gender: string;
  postsCount: number;
  totalViews: number;
  totalLikes: number;
  bio: string;
  joinedSquads: string[];
  skills: string[];
  socials?: Array<{ platform: string; url: string }>;
  role: UserRole;
  username: string;
  isPremium: boolean;
  googleId?: string;
  githubId?: string;
  isBlocked: boolean;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    location: { type: String },
    phone: { type: Number },
    profilePic: {
      type: String,
      default:
        'https://res.cloudinary.com/dhvlhpg55/image/upload/v1740028408/nexus/images/oamn3bzchpmixago65yf.jpg',
    },
    profilePicPublicId: {
      type: String,
    },
    gender: {
      type: String,
    },
    postsCount: {
      type: Number,
      default: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
    },
    joinedSquads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Squad',
      },
    ],
    skills: {
      type: [String],
    },
    socials: [
      {
        platform: String,
        url: String,
      },
    ],
    role: {
      type: String,
      required: true,
      default: 'user',
    },
    username: {
      type: String,
      required: true,
    },
    isPremium: { type: Boolean, default: false },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({
  name: 'text',
  username: 'text',
  email: 'text',
});

const UserModel = mongoose.model<IUser>('User', UserSchema);
export { UserModel, IUser };
