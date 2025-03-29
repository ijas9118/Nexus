import mongoose, { Document } from 'mongoose';

export interface IChannel extends Document {
  name: string;
  members: mongoose.Types.ObjectId[];
  admin: mongoose.Types.ObjectId;
  messages: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ChannelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    admin: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Message',
        required: false,
      },
    ],
  },
  { timestamps: true }
);

const ChannelModel = mongoose.model<IChannel>('Channel', ChannelSchema);
export default ChannelModel;
