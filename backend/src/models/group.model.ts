import mongoose, { Document, Schema } from 'mongoose';

export interface IGroup extends Document {
  _id: string;
  name: string;
  members: string[]; // Array of User IDs (2 or more)
  createdBy: string; // User ID
  unreadCounts: { userId: string; count: number }[];
  lastMessage?: {
    content?: string;
    fileUrl?: string;
    fileType?: 'image' | 'video' | 'pdf';
    sender: string; // userId
    createdAt: Date;
  };
}

const groupSchema = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        type: String,
        ref: 'User',
        required: true,
      },
    ],
    createdBy: {
      type: String,
      ref: 'User',
      required: true,
    },
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

groupSchema.pre('save', function (next) {
  if (this.members.length < 2) {
    next(new Error('Groups must have at least 2 members'));
  } else {
    next();
  }
});

groupSchema.index({ members: 1 });

export const GroupModel = mongoose.model<IGroup>('Group', groupSchema);
