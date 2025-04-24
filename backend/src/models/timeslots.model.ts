import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface ITimeSlot extends Document {
  mentorId: ObjectId | string;
  date: Date; // e.g., "2025-04-23T00:00:00.000Z"
  startTime: string; // e.g., "14:00"
  endTime: string; // e.g., "15:00"
  isBooked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TimeSlotSchema: Schema = new Schema(
  {
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by mentor and date
TimeSlotSchema.index({ mentorId: 1, date: 1, isBooked: 1 });

// Ensure no overlapping slots for the same mentor
TimeSlotSchema.index(
  { mentorId: 1, date: 1, startTime: 1 },
  {
    unique: true,
    partialFilterExpression: { isBooked: false },
  }
);

export const TimeSlotModel = mongoose.model<ITimeSlot>('TimeSlot', TimeSlotSchema);
