import mongoose, { Document, Schema } from 'mongoose';

export interface IChat extends Document {
  _id: string;
  participants: string[]; // Array of User IDs (exactly 2 for one-on-one)
}

const chatSchema = new Schema<IChat>(
  {
    participants: [
      {
        type: String,
        ref: 'User',
        required: true,
      },
    ],
  },
  { timestamps: true }
);

chatSchema.pre('save', function (next) {
  if (this.participants.length !== 2) {
    next(new Error('One-on-one chats must have exactly 2 participants'));
  } else {
    next();
  }
});

export const ChatModel = mongoose.model<IChat>('Chat', chatSchema);
