import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IMentor extends Document {
  userId: ObjectId;
  specialization: string;
  availability: {
    days: string[]; // ["Monday", "Wednesday"]
    timeSlots: string[]; // ["10:00-12:00", "14:00-16:00"]
  };
  verified: boolean;
  squadsCreated: mongoose.Types.ObjectId[];
  rating: number;
}

const MentorSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    availability: {
      days: [
        {
          type: String,
          required: true,
        },
      ],
      timeSlots: [
        {
          type: String,
          required: true,
        },
      ],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    squadsCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Squad",
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMentor>("Mentor", MentorSchema);
