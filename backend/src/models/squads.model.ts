import mongoose, { Schema, Document } from "mongoose";

interface ISquad extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  handle: string;
  members: mongoose.Types.ObjectId[];
  logo: string;
  category: string;
  isActive: boolean;
}

const SquadSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
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
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const SquadModel = mongoose.model<ISquad>("Squad", SquadSchema);
export { ISquad, SquadModel };
