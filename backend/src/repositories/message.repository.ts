import mongoose from 'mongoose';
import { BaseRepository } from '../core/abstracts/base.repository';
import { IMessageRepository } from '../core/interfaces/repositories/IMessageRepository';
import MessageModel, { IMessage } from '../models/message.model';
import { IChatRepository } from '../core/interfaces/repositories/IChatRepository';
import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import { FormatTime } from '../utils/formatTime';

@injectable()
export class MessageRepository extends BaseRepository<IMessage> implements IMessageRepository {
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
      sender: new mongoose.Types.ObjectId(sender),
    });

    await this.chatRepository.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(chatId) },
      { lastMessage: message._id, $inc: { unreadMessages: 1 } }
    );

    return message;
  };

  getAllMessages = async (user1: string, user2: string): Promise<IMessage[]> => {
    const messages = await this.model
      .find({
        $or: [
          {
            sender: user1,
            recipient: user2,
          },
          {
            sender: user2,
            recipient: user1,
          },
        ],
      })
      .sort({ updatedAt: 1 });
    return messages;
  };
}
