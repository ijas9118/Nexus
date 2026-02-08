import type { Document } from "mongoose";

import mongoose, { Schema } from "mongoose";

interface ISquad extends Document<string> {
  name: string;
  admin: string;
  description: string;
  handle: string;
  members: string[];
  logo: string;
  postCount: number;
  viewCount: number;
  upvoteCount: number;
  membersCount: number;
  category: string;
  isActive: boolean;
  isPremium: boolean;
}

const SquadSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    handle: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    logo: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    postCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    upvoteCount: {
      type: Number,
      default: 0,
    },
    membersCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

SquadSchema.index({ name: "text", category: "text" });

const SquadModel = mongoose.model<ISquad>("Squad", SquadSchema);
export { ISquad, SquadModel };
