import { injectable } from "inversify";

import type { IMessageRepository } from "@/core/interfaces/repositories/i-message-repository";
import type { IMessage } from "@/models/communication/message.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { MessageModel } from "@/models/communication/message.model";

@injectable()
export class MessageRepository extends BaseRepository<IMessage> implements IMessageRepository {
  constructor() {
    super(MessageModel);
  }

  async getMessagesByChat(chatId: string, chatType: "Chat" | "Group"): Promise<IMessage[]> {
    return this._model.find({ chatId, chatType, isDeleted: false }).sort({ createdAt: 1 });
  }

  async getUnreadCount(
    userId: string,
    chatId: string,
    chatType: "Chat" | "Group",
  ): Promise<number> {
    return this._model.countDocuments({
      chatId,
      chatType,
      isDeleted: false,
      readBy: { $ne: userId },
    });
  }

  async markMessagesAsRead(
    chatId: string,
    chatType: "Chat" | "Group",
    userId: string,
  ): Promise<void> {
    await this._model.updateMany(
      { chatId, chatType, isDeleted: false, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } },
    );
  }

  async addReaction(messageId: string, userId: string, reaction: string): Promise<IMessage | null> {
    return this._model.findByIdAndUpdate(
      messageId,
      { $push: { reactions: { userId, reaction } } },
      { new: true },
    );
  }

  async removeReaction(messageId: string, userId: string): Promise<IMessage | null> {
    return this._model.findByIdAndUpdate(
      messageId,
      { $pull: { reactions: { userId } } },
      { new: true },
    );
  }

  async softDeleteMessage(messageId: string): Promise<IMessage | null> {
    return this._model.findByIdAndUpdate(messageId, { isDeleted: true }, { new: true });
  }
}
