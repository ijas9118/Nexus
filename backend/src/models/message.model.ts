import mongoose from 'mongoose';

export interface IMessage extends mongoose.Document {
  chatId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  text: string;
  read: boolean;
  createdAt: Date;
}

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
export default MessageModel;
