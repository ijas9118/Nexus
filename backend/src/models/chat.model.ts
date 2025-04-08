import mongoose, { Document, Schema } from 'mongoose';

export interface IChat extends Document {
  _id: string;
  participants: string[]; // Array of User IDs (exactly 2 for one-on-one)
  unreadCounts: { userId: string; count: number }[];
  lastMessage?: {
    content?: string;
    fileUrl?: string;
    fileType?: 'image' | 'video' | 'pdf';
    sender: string;
    createdAt: Date;
  };
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
    unreadCounts: [
      {
        userId: {
          type: String,
          ref: 'User',
          required: true,
        },
        count: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    lastMessage: {
      content: { type: String },
      fileUrl: { type: String },
      fileType: {
        type: String,
        enum: ['image', 'video', 'pdf'],
      },
      sender: {
        type: String,
        ref: 'User',
        required: true,
      },
      createdAt: {
        type: Date,
        required: true,
      },
    },
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

chatSchema.index({ participants: 1 });

export const ChatModel = mongoose.model<IChat>('Chat', chatSchema);
