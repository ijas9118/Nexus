import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IConnection extends Document {
  userId: ObjectId; // The user sending the connection request
  connectionId: ObjectId; // The user receiving the request
  status: "pending" | "connected" | "rejected" | "blocked";
  message?: string;
}

const ConnectionSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    connectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "connected", "rejected", "blocked"],
      default: "pending",
    },
    message: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

ConnectionSchema.index({ userId: 1, connectionId: 1 }, { unique: true });

export default mongoose.model<IConnection>("Connection", ConnectionSchema);
