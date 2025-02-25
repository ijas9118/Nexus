import mongoose from "mongoose";

export interface IChat extends mongoose.Document {
  members: mongoose.Types.ObjectId[];
  lastMessage: mongoose.Types.ObjectId;
  unreadMessages: number;
}

const ChatSchema = new mongoose.Schema(
  {
    members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    unreadMessages: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const ChatModel = mongoose.model<IChat>("Chat", ChatSchema);
export default ChatModel;
