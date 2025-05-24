import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document<string> {
  rating: number;
  feedback?: string;
  mentorId: Types.ObjectId;
  userId: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    rating: {
      type: Number,
      required: true,
      min: 0.5,
      max: 5,
      validate: {
        validator: function (value: number) {
          return (value * 2) % 1 === 0;
        },
        message: 'Rating must be in increments of 0.5',
      },
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate reviews from same user to same mentor
reviewSchema.index({ mentorId: 1, userId: 1 }, { unique: true });

// Index for efficient queries
reviewSchema.index({ mentorId: 1, isActive: 1 });
reviewSchema.index({ userId: 1, isActive: 1 });

export const Review = model<IReview>('Review', reviewSchema);
