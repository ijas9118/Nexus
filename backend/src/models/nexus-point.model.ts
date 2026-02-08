import type { Document } from "mongoose";

import mongoose, { Schema } from "mongoose";

export interface INexusPoint extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | string;
  points: number;
  type: "earned" | "redeemed";
  description: string;
  createdAt: Date;
}

const NexusPointSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["earned", "redeemed"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const NexusPointModel = mongoose.model<INexusPoint>("NexusPoint", NexusPointSchema);
