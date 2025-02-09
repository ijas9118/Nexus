import mongoose, { Schema, Document } from "mongoose";

interface ISquad extends Document {
  name: string;
  description: string;
  handle: string;
  membersCount: number;
  logo: string;
  category: mongoose.Types.ObjectId;
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
    membersCount: {
      type: Number,
      default: 0,
    },
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
