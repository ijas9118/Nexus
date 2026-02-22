import type { Server as SocketIOServer } from "socket.io";

import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import mongoose, { Types } from "mongoose";

import type { IChatRepository } from "@/core/interfaces/repositories/i-chat-repository";
import type { IConnectionsRepository } from "@/core/interfaces/repositories/i-connections-repository";
import type { IGroupRepository } from "@/core/interfaces/repositories/i-group-repository";
import type { IMessageRepository } from "@/core/interfaces/repositories/i-message-repository";
import type { IMessageService } from "@/core/interfaces/services/i-message-service";
import type { IMessage } from "@/models/communication/message.model";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { CHAT_MESSAGES } = MESSAGES;

@injectable()
export class MessageService implements IMessageService {
  constructor(
    @inject(TYPES.MessageRepository) protected repository: IMessageRepository,
    @inject(TYPES.ChatRepository) private chatRepository: IChatRepository,
    @inject(TYPES.GroupRepository) private groupRepository: IGroupRepository,
    @inject(TYPES.ConnectionsRepository) private connectionsRepository: IConnectionsRepository,
  ) {}

  async sendMessage(
    userId: string,
    chatId: string,
    chatType: "Chat" | "Group",
    content?: string,
    fileUrl?: string,
    fileType?: "image" | "video" | "pdf",
    replyTo?: string,
    io?: SocketIOServer,
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

    const lastMessagePayload = {
      content: message.content,
      fileUrl: message.fileUrl,
      fileType: message.fileType,
      sender: message.sender,
      createdAt: message.createdAt,
    };

    if (message.chatType === "Chat") {
      await this.chatRepository.findByIdAndUpdate(new mongoose.Types.ObjectId(message.chatId), {
        lastMessage: lastMessagePayload,
      });
    }
    else {
      await this.groupRepository.findByIdAndUpdate(new mongoose.Types.ObjectId(message.chatId), {
        lastMessage: lastMessagePayload,
      });
    }

    if (chatType === "Chat") {
      const chat = await this.chatRepository.findById(new Types.ObjectId(chatId));
      if (chat) {
        const updatedUnreadCounts = chat.participants.map((participantId) => {
          if (participantId === userId)
            return { userId: participantId, count: 0 };

          const existing = chat.unreadCounts.find(uc => uc.userId === participantId);
          return {
            userId: participantId,
            count: existing ? existing.count + 1 : 1,
          };
        });

        await this.chatRepository.updateOne(
          { _id: chatId },
          { $set: { unreadCounts: updatedUnreadCounts } },
        );
      }
    }
    else {
      const group = await this.groupRepository.findById(new Types.ObjectId(chatId));
      if (group) {
        const updatedUnreadCounts = group.members.map((memberId) => {
          if (memberId === userId)
            return { userId: memberId, count: 0 };

          const existing = group.unreadCounts.find(uc => uc.userId === memberId);
          return {
            userId: memberId,
            count: existing ? existing.count + 1 : 1,
          };
        });

        await this.groupRepository.updateOne(
          { _id: chatId },
          { $set: { unreadCounts: updatedUnreadCounts } },
        );
      }
    }

    if (io) {
      io.to(chatId).emit("newMessage", message);
    }

    return message;
  }

  async addReaction(
    userId: string,
    messageId: string,
    reaction: string,
    io?: SocketIOServer,
  ): Promise<IMessage> {
    const message = await this.repository.findById(new Types.ObjectId(messageId));
    if (!message || message.isDeleted) {
      throw new CustomError(CHAT_MESSAGES.MESSAGE_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    await this.validateChatAccess(userId, message.chatId, message.chatType);

    // Ensure one reaction per user
    const existingReaction = message.reactions.find(r => r.userId === userId);
    if (existingReaction) {
      await this.repository.removeReaction(messageId, userId);
    }

    const updatedMessage = await this.repository.addReaction(messageId, userId, reaction);

    if (io && updatedMessage) {
      io.to(message.chatId).emit("messageReaction", updatedMessage);
    }
    return updatedMessage!;
  }

  async removeReaction(userId: string, messageId: string, io?: SocketIOServer): Promise<IMessage> {
    const message = await this.repository.findById(new Types.ObjectId(messageId));
    if (!message || message.isDeleted) {
      throw new CustomError(CHAT_MESSAGES.MESSAGE_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    await this.validateChatAccess(userId, message.chatId, message.chatType);

    const updatedMessage = await this.repository.removeReaction(messageId, userId);

    if (io && updatedMessage) {
      io.to(message.chatId).emit("reactionRemoved", updatedMessage);
    }
    return updatedMessage!;
  }

  async deleteMessage(userId: string, messageId: string, io?: SocketIOServer): Promise<IMessage> {
    const message = await this.repository.findById(new Types.ObjectId(messageId));
    if (!message || message.isDeleted) {
      throw new CustomError(CHAT_MESSAGES.MESSAGE_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    if (message.sender !== userId) {
      throw new CustomError(CHAT_MESSAGES.DELETE_ONLY_SENDER, StatusCodes.FORBIDDEN);
    }

    await this.validateChatAccess(userId, message.chatId, message.chatType);

    const updatedMessage = await this.repository.softDeleteMessage(messageId);

    if (io && updatedMessage) {
      io.to(message.chatId).emit("messageDeleted", updatedMessage);
    }
    return updatedMessage!;
  }

  async getMessages(
    userId: string,
    chatId: string,
    chatType: "Chat" | "Group",
  ): Promise<IMessage[]> {
    await this.validateChatAccess(userId, chatId, chatType, false); // Read-only, no connection check

    return this.repository.getMessagesByChat(chatId, chatType);
  }

  async getUnreadCount(
    userId: string,
    chatId: string,
    chatType: "Chat" | "Group",
  ): Promise<number> {
    await this.validateChatAccess(userId, chatId, chatType, false); // Read-only, no connection check

    return this.repository.getUnreadCount(userId, chatId, chatType);
  }

  async markMessagesAsRead(
    userId: string,
    chatId: string,
    chatType: "Chat" | "Group",
    io?: SocketIOServer,
  ): Promise<void> {
    await this.validateChatAccess(userId, chatId, chatType, false); // Read-only operation

    await this.repository.markMessagesAsRead(chatId, chatType, userId);

    if (chatType === "Chat") {
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
          { $set: { unreadCounts: updatedUnreadCounts } },
        );
      }
    }
    else {
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
          { $set: { unreadCounts: updatedUnreadCounts } },
        );
      }
    }

    if (io) {
      io.to(chatId).emit("messagesRead", { chatId, userId, chatType });
    }
  }

  private async validateChatAccess(
    userId: string,
    chatId: string,
    chatType: "Chat" | "Group",
    requireConnection = true, // true for write operations like sending messages
  ): Promise<void> {
    if (chatType === "Chat") {
      const chat = await this.chatRepository.findById(new Types.ObjectId(chatId));
      if (!chat || !chat.participants.includes(userId)) {
        throw new CustomError(CHAT_MESSAGES.CHAT_ACCESS_DENIED, StatusCodes.FORBIDDEN);
      }

      // For direct chats, check if users are still connected (only for write operations)
      if (requireConnection) {
        const otherParticipant = chat.participants.find(p => p !== userId);
        if (otherParticipant) {
          const isConnected = await this.connectionsRepository.isConnected(userId, otherParticipant);
          if (!isConnected) {
            throw new CustomError(
              CHAT_MESSAGES.NO_LONGER_CONNECTED,
              StatusCodes.FORBIDDEN,
            );
          }
        }
      }
    }
    else {
      const group = await this.groupRepository.findById(new Types.ObjectId(chatId));
      if (!group || !group.members.includes(userId)) {
        throw new CustomError(CHAT_MESSAGES.GROUP_ACCESS_DENIED, StatusCodes.FORBIDDEN);
      }
    }
  }
}
