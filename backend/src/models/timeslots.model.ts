import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface ITimeSlot extends Document<string> {
  mentorId: ObjectId | string;
  date: Date; // e.g., "2025-04-23T00:00:00.000Z"
  startTime: string; // e.g., "14:00"
  endTime: string; // e.g., "15:00"
  isBooked: boolean;
  status: 'available' | 'reserved' | 'booked';
  reservedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TimeSlotSchema: Schema = new Schema(
  {
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: 'Mentor',
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
    status: {
      type: String,
      enum: ['available', 'reserved', 'booked'],
      default: 'available',
    },
    reservedUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

TimeSlotSchema.index({ mentorId: 1, date: 1, status: 1 });

TimeSlotSchema.index(
  { mentorId: 1, date: 1, startTime: 1 },
  {
    unique: true,
  }
);

export const TimeSlotModel = mongoose.model<ITimeSlot>('TimeSlot', TimeSlotSchema);
