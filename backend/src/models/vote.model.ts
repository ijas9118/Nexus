import type { Document, Types } from "mongoose";

import { model, Schema } from "mongoose";

export interface IVote extends Document {
  contentId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  voteType: "upvote" | "downvote";
}

const VoteSchema = new Schema<IVote>(
  {
    contentId: {
      type: Schema.Types.ObjectId,
      ref: "Content",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    voteType: {
      type: String,
      enum: ["upvote", "downvote"],
      required: true,
    },
  },
  { timestamps: true },
);

export const VoteModel = model<IVote>("Vote", VoteSchema);
