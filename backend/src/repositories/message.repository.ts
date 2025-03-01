import mongoose from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IMessageRepository } from "../core/interfaces/repositories/IMessageRepository";
import MessageModel, { IMessage } from "../models/message.model";
import { IChatRepository } from "../core/interfaces/repositories/IChatRepository";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";

@injectable()
export class MessageRepository
  extends BaseRepository<IMessage>
  implements IMessageRepository
{
  constructor(@inject(TYPES.ChatRepository) private chatRepository: IChatRepository) {
    super(MessageModel);
  }

  createNewMessage = async (data: {
    chatId: string;
    sender: string;
    text: string;
  }): Promise<IMessage> => {
    const { chatId, sender, text } = data;
    const message = await this.create({
      chatId: new mongoose.Types.ObjectId(chatId),
      sender: new mongoose.Types.ObjectId(sender),
      text,
    });

    await this.chatRepository.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(chatId) },
      { lastMessage: message._id, $inc: { unreadMessages: 1 } }
    );

    return message;
  };

  getAllMessages = async (chatId: string): Promise<IMessage[]> => {
    const messages = await MessageModel.find({
      chatId: new mongoose.Types.ObjectId(chatId),
    })
      .sort({ createdAt: 1 }) // Sort by createdAt in ascending order
      .populate("sender", "name profilePic"); // Populate sender details

    return messages;
  };
}
