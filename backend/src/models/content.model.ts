import mongoose, { Schema, Document } from "mongoose";
import { ContentStatus, ContentType, Tag } from "../core/types/content.types";
import { IUser } from "./user.model";

export interface IContent extends Document {
  avatarFallback: string;
  author: IUser["_id"];
  userName: string;
  type: ContentType;
  heading: string;
  date: string;
  likes: number;
  comments: number;
  tags: Tag[];
  isPremium: boolean;
  thumbnail: string;
  status: ContentStatus;
}

const ContentSchema: Schema = new Schema(
  {
    avatarFallback: {
      type: String,
      required: true,
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
    type: {
      type: String,
      enum: Object.values(ContentType),
      required: true,
    },
    heading: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      required: true,
      default: 0,
    },
    comments: {
      type: Number,
      required: true,
      default: 0,
    },
    tags: {
      type: [{ id: String, name: String }],
      required: true,
    },
    isPremium: {
      type: Boolean,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ContentStatus),
      required: true,
      default: ContentStatus.DRAFT,
    },
  },
  {
    timestamps: true,
  }
);

const ContentModel = mongoose.model<IContent>("Content", ContentSchema);
export default ContentModel;
