import mongoose from 'mongoose';

export interface IMessage extends mongoose.Document {
  sender: mongoose.Types.ObjectId;
  recipient?: mongoose.Types.ObjectId;
  messageType: string;
  content: string;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    messageType: {
      type: String,
      enum: ['text', 'file'],
      required: true,
    },
    content: {
      type: String,
      required: function (this: IMessage) {
        return this.messageType === 'text';
      },
    },
    fileUrl: {
      type: String,
      required: function (this: IMessage) {
        return this.messageType === 'file';
      },
    },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
export default MessageModel;
