import { BaseRepository } from '@/core/abstracts/base.repository';
import { IMessageRepository } from '@/core/interfaces/repositories/IMessageRepository';
import { IMessage, MessageModel } from '@/models/message.model';
import { injectable } from 'inversify';

@injectable()
export class MessageRepository extends BaseRepository<IMessage> implements IMessageRepository {
  constructor() {
    super(MessageModel);
  }

  async getMessagesByChat(chatId: string, chatType: 'Chat' | 'Group'): Promise<IMessage[]> {
    return this.model.find({ chatId, chatType, isDeleted: false }).sort({ createdAt: 1 });
  }

  async getUnreadCount(
    userId: string,
    chatId: string,
    chatType: 'Chat' | 'Group'
  ): Promise<number> {
    return this.model.countDocuments({
      chatId,
      chatType,
      isDeleted: false,
      readBy: { $ne: userId },
    });
  }

  async markMessagesAsRead(
    chatId: string,
    chatType: 'Chat' | 'Group',
    userId: string
  ): Promise<void> {
    await this.model.updateMany(
      { chatId, chatType, isDeleted: false, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );
  }

  async addReaction(messageId: string, userId: string, reaction: string): Promise<IMessage | null> {
    return this.model.findByIdAndUpdate(
      messageId,
      { $push: { reactions: { userId, reaction } } },
      { new: true }
    );
  }

  async removeReaction(messageId: string, userId: string): Promise<IMessage | null> {
    return this.model.findByIdAndUpdate(
      messageId,
      { $pull: { reactions: { userId } } },
      { new: true }
    );
  }

  async softDeleteMessage(messageId: string): Promise<IMessage | null> {
    return this.model.findByIdAndUpdate(messageId, { isDeleted: true }, { new: true });
  }
}
