import type { Document } from 'mongoose';

import mongoose, { Schema } from 'mongoose';

export interface IChat extends Document<string> {
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
      },
      createdAt: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);

chatSchema.index({ participants: 1 });

export const ChatModel = mongoose.model<IChat>('Chat', chatSchema);
