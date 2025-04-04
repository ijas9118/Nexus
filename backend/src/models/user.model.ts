import { UserRole } from '@/core/types/global/user-role';
import mongoose, { Schema, Document, ObjectId } from 'mongoose';

interface IUser extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  profilePic: string;
  profilePicPublicId?: string;
  gender: string;
  place: string;
  postsCount: number;
  totalViews: number;
  totalLikes: number;
  bio: string;
  joinedSquads: mongoose.Types.ObjectId[];
  streak: {
    current: number;
    longest: number;
    total: number;
  };
  skills: string[];
  socials: [{ platform: string; url: string }];
  role: UserRole;
  username: string;
  isPremium: boolean;
  googleId?: string;
  githubId?: string;
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
    place: {
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
    streak: {
      current: {
        type: Number,
        default: 0,
      },
      longest: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        default: 0,
      },
    },
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
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUser>('User', UserSchema);
export { UserModel, IUser };
