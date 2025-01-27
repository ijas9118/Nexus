import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model";

export interface IContent extends Document {
  avatarFallback: string;
  author: IUser["_id"];
  userName: string;
  contentType: string;
  title: string;
  date: string;
  likes: number;
  comments: number;
  squad: string;
  isPremium: boolean;
  thumbnailUrl: string;
  videoUrl: string;
  content: string;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
}

const ContentSchema: Schema = new Schema(
  {
    avatarFallback: {
      type: String,
      // required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      enum: ["blog", "video"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    squad: {
      type: String,
      required: true,
    },
    isPremium: {
      type: Boolean,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
    },
    content: {
      type: String,
      required: function (this: any) {
        return this.contentType === "blog";
      },
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    bookmarkCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const ContentModel = mongoose.model<IContent>("Content", ContentSchema);
export default ContentModel;
