import mongoose, { Schema, Document } from 'mongoose';

interface IBooking extends Document {
  _id: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  mentorId: mongoose.Types.ObjectId | string;
  mentorshipType: mongoose.Types.ObjectId | string;
  timeSlot: mongoose.Types.ObjectId | string;
  bookingDate: Date;
  reason: string;
  status: 'pending' | 'confirmed' | 'completed';
  meetUrl?: string;
}

const BookingSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mentor',
      required: true,
    },
    mentorshipType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MentorshipType',
      required: true,
    },
    timeSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimeSlot',
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed'],
      default: 'pending',
    },
    meetUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const BookingModel = mongoose.model<IBooking>('Booking', BookingSchema);
export { IBooking, BookingModel };
