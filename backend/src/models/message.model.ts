import type { Document } from 'mongoose';

import mongoose, { Schema } from 'mongoose';

export interface IMessage extends Document<string> {
  chatId: string; // Refers to Chat ID or Group ID
  chatType: 'Chat' | 'Group';
  sender: string;
  content?: string;
  fileUrl?: string;
  fileType?: 'image' | 'video' | 'pdf';
  reactions: { userId: string; reaction: string }[];
  replyTo?: string;
  isDeleted: boolean;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: String,
      required: true,
      refPath: 'chatType',
    },
    chatType: {
      type: String,
      required: true,
      enum: ['Chat', 'Group'],
    },
    sender: {
      type: String,
      ref: 'User',
      required: true,
    },
    content: { type: String },
    fileUrl: { type: String },
    fileType: {
      type: String,
      enum: ['image', 'video', 'pdf'],
    },
    reactions: [
      {
        userId: { type: String, ref: 'User' },
        reaction: String,
      },
    ],
    replyTo: {
      type: String,
      ref: 'Message',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    readBy: [
      {
        type: String,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model<IMessage>('Message', messageSchema);
