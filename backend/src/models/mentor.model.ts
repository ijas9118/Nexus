import mongoose, { Schema, Document, ObjectId } from 'mongoose';

interface IMentor extends Document {
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
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
    },
    availability: {
      days: [
        {
          type: String,
        },
      ],
      timeSlots: [
        {
          type: String,
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
        ref: 'Squad',
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

const MentorModel = mongoose.model<IMentor>('Mentor', MentorSchema);
export { IMentor, MentorModel };
