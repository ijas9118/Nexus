import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  profilePic: string;
  gender: string;
  place: string;
  followers: number;
  following: number;
  connections: number;
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
  socials: {
    github: string;
    linkedin: string;
  };
}

const UserSchema: Schema = new Schema({
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
  },
  gender: {
    type: String,
  },
  place: {
    type: String,
  },
  followers: {
    type: Number,
    default: 0,
  },
  following: {
    type: Number,
    default: 0,
  },
  connections: {
    type: Number,
    default: 0,
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
      ref: "Squad",
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
  socials: {
    github: {
      type: String,
    },
    linkedin: {
      type: String,
    },
  },
});

export default mongoose.model<IUser>("User", UserSchema);
