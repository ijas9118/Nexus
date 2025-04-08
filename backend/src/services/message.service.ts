import { BaseService } from '@/core/abstracts/base.service';
import { IChatRepository } from '@/core/interfaces/repositories/IChatRepository';
import { IGroupRepository } from '@/core/interfaces/repositories/IGroupRepository';
import { IMessageRepository } from '@/core/interfaces/repositories/IMessageRepository';
import { IMessageService } from '@/core/interfaces/services/IMessageService';
import { TYPES } from '@/di/types';
import { IMessage } from '@/models/message.model';
import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';

@injectable()
export class MessageService extends BaseService<IMessage> implements IMessageService {
  constructor(
    @inject(TYPES.MessageRepository) protected repository: IMessageRepository,
    @inject(TYPES.ChatRepository) private chatRepository: IChatRepository,
    @inject(TYPES.GroupRepository) private groupRepository: IGroupRepository
  ) {
    super(repository);
  }

  async sendMessage(
    userId: string,
    chatId: string,
    chatType: 'Chat' | 'Group',
    content?: string,
    fileUrl?: string,
    fileType?: 'image' | 'video' | 'pdf',
    replyTo?: string,
    io?: SocketIOServer
  ): Promise<IMessage> {
    await this.validateChatAccess(userId, chatId, chatType);

    const message = await this.repository.create({
      chatId,
      chatType,
      sender: userId,
      content,
      fileUrl,
      fileType,
      replyTo,
      readBy: [userId], // Sender has read their own message
    });

    if (chatType === 'Chat') {
      const chat = await this.chatRepository.findById(new Types.ObjectId(chatId));
      if (chat) {
        const updatedUnreadCounts = chat.participants.map((participantId) => {
          if (participantId === userId) return { userId: participantId, count: 0 };

          const existing = chat.unreadCounts.find((uc) => uc.userId === participantId);
          return {
            userId: participantId,
            count: existing ? existing.count + 1 : 1,
          };
        });

        await this.chatRepository.updateOne(
          { _id: chatId },
          { $set: { unreadCounts: updatedUnreadCounts } }
        );
      }
    } else {
      const group = await this.groupRepository.findById(new Types.ObjectId(chatId));
      if (group) {
        const updatedUnreadCounts = group.members.map((memberId) => {
          if (memberId === userId) return { userId: memberId, count: 0 };

          const existing = group.unreadCounts.find((uc) => uc.userId === memberId);
          return {
            userId: memberId,
            count: existing ? existing.count + 1 : 1,
          };
        });

        await this.groupRepository.updateOne(
          { _id: chatId },
          { $set: { unreadCounts: updatedUnreadCounts } }
        );
      }
    }

    if (io) {
      io.to(chatId).emit('newMessage', message);
    }

    return message;
  }

  async addReaction(
    userId: string,
    messageId: string,
    reaction: string,
    io?: SocketIOServer
  ): Promise<IMessage> {
    const message = await this.repository.findById(new Types.ObjectId(messageId));
    if (!message || message.isDeleted) throw new Error('Message not found');

    await this.validateChatAccess(userId, message.chatId, message.chatType);

    // Ensure one reaction per user
    const existingReaction = message.reactions.find((r) => r.userId === userId);
    if (existingReaction) {
      await this.repository.removeReaction(messageId, userId);
    }

    const updatedMessage = await this.repository.addReaction(messageId, userId, reaction);

    if (io && updatedMessage) {
      io.to(message.chatId).emit('messageReaction', updatedMessage);
    }
    return updatedMessage!;
  }

  async removeReaction(userId: string, messageId: string, io?: SocketIOServer): Promise<IMessage> {
    const message = await this.repository.findById(new Types.ObjectId(messageId));
    if (!message || message.isDeleted) throw new Error('Message not found');

    await this.validateChatAccess(userId, message.chatId, message.chatType);

    const updatedMessage = await this.repository.removeReaction(messageId, userId);

    if (io && updatedMessage) {
      io.to(message.chatId).emit('reactionRemoved', updatedMessage);
    }
    return updatedMessage!;
  }

  async deleteMessage(userId: string, messageId: string, io?: SocketIOServer): Promise<IMessage> {
    const message = await this.repository.findById(new Types.ObjectId(messageId));
    if (!message || message.isDeleted) throw new Error('Message not found');
    if (message.sender !== userId) throw new Error('Only the sender can delete a message');

    await this.validateChatAccess(userId, message.chatId, message.chatType);

    const updatedMessage = await this.repository.softDeleteMessage(messageId);

    if (io && updatedMessage) {
      io.to(message.chatId).emit('messageDeleted', updatedMessage);
    }
    return updatedMessage!;
  }

  async getMessages(
    userId: string,
    chatId: string,
    chatType: 'Chat' | 'Group'
  ): Promise<IMessage[]> {
    await this.validateChatAccess(userId, chatId, chatType);

    return this.repository.getMessagesByChat(chatId, chatType);
  }

  async getUnreadCount(
    userId: string,
    chatId: string,
    chatType: 'Chat' | 'Group'
  ): Promise<number> {
    await this.validateChatAccess(userId, chatId, chatType);

    return this.repository.getUnreadCount(userId, chatId, chatType);
  }

  async markMessagesAsRead(
    userId: string,
    chatId: string,
    chatType: 'Chat' | 'Group',
    io?: SocketIOServer
  ): Promise<void> {
    await this.validateChatAccess(userId, chatId, chatType);

    await this.repository.markMessagesAsRead(chatId, chatType, userId);

    if (chatType === 'Chat') {
      const chat = await this.chatRepository.findById(new Types.ObjectId(chatId));
      if (chat) {
        const updatedUnreadCounts = chat.unreadCounts.map((uc) => {
          if (uc.userId === userId) {
            return {
              userId: uc.userId,
              count: 0,
            };
          }
          return {
            userId: uc.userId,
            count: uc.count,
          };
        });

        await this.chatRepository.updateOne(
          { _id: chatId },
          { $set: { unreadCounts: updatedUnreadCounts } }
        );
      }
    } else {
      const group = await this.groupRepository.findById(new Types.ObjectId(chatId));
      if (group) {
        const updatedUnreadCounts = group.unreadCounts.map((uc) => {
          if (uc.userId === userId) {
            return {
              userId: uc.userId,
              count: 0,
            };
          }
          return {
            userId: uc.userId,
            count: uc.count,
          };
        });

        await this.groupRepository.updateOne(
          { _id: chatId },
          { $set: { unreadCounts: updatedUnreadCounts } }
        );
      }
    }

    if (io) {
      io.to(chatId).emit('messagesRead', { chatId, userId, chatType });
    }
  }

  private async validateChatAccess(
    userId: string,
    chatId: string,
    chatType: 'Chat' | 'Group'
  ): Promise<void> {
    if (chatType === 'Chat') {
      const chat = await this.chatRepository.findById(new Types.ObjectId(chatId));
      if (!chat || !chat.participants.includes(userId)) {
        throw new Error('User does not have access to this chat');
      }
    } else {
      const group = await this.groupRepository.findById(new Types.ObjectId(chatId));
      if (!group || !group.members.includes(userId)) {
        throw new Error('User does not have access to this group');
      }
    }
  }
}
