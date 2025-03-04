import mongoose, { Schema, Document } from "mongoose";

export interface IContent extends Document {
  avatarFallback: string;
  author: mongoose.Types.ObjectId;
  userName: string;
  contentType: string;
  title: string;
  date: string;
  likes: number;
  squad: mongoose.Types.ObjectId;
  isPremium: boolean;
  thumbnailUrl: string;
  videoUrl: string;
  content: string;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  isVerified: boolean;
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
      enum: ["Blog", "Video"],
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
    squad: {
      type: mongoose.Types.ObjectId,
      ref: "Squad",
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
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ContentModel = mongoose.model<IContent>("Content", ContentSchema);
export default ContentModel;
