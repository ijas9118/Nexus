import mongoose, { Document, Schema } from 'mongoose';

export interface IGroup extends Document {
  _id: string;
  name: string;
  members: string[]; // Array of User IDs (2 or more)
  createdBy: string; // User ID
}

const groupSchema = new Schema<IGroup>({
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
});

groupSchema.pre('save', function (next) {
  if (this.members.length < 2) {
    next(new Error('Groups must have at least 2 members'));
  } else {
    next();
  }
});

export const GroupModel = mongoose.model<IGroup>('Group', groupSchema);
