import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IChatRepository } from "@/core/interfaces/repositories/i-chat-repository";
import type { IChatService } from "@/core/interfaces/services/i-chat-service";
import type { IConnectionService } from "@/core/interfaces/services/i-connection-service";
import type { IChat } from "@/models/communication/chat.model";

import { TYPES } from "@/di/types";
import { ChatModel } from "@/models/communication/chat.model";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { CHAT_MESSAGES } = MESSAGES;

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject(TYPES.ChatRepository) protected repository: IChatRepository,
    @inject(TYPES.ConnectionService) private connectionService: IConnectionService,
  ) {}

  async createChat(userId: string, otherUserId: string): Promise<IChat> {
    const isConnected = await this.connectionService.isConnected(userId, otherUserId);
    if (!isConnected) {
      throw new CustomError(CHAT_MESSAGES.CONNECTION_REQUIRED, StatusCodes.FORBIDDEN);
    }

    // Check if chat already exists
    let chat = await this.repository.findChatBetweenUsers(userId, otherUserId);
    if (!chat) {
      chat = await this.repository.create({ participants: [userId, otherUserId] });
    }
    const populatedChat = await ChatModel.findById(chat._id).populate(
      "participants",
      "name username profilePic",
    );

    if (!populatedChat) {
      throw new CustomError(CHAT_MESSAGES.FETCH_FAILED, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return populatedChat;
  }

  async getUserChats(userId: string): Promise<IChat[]> {
    return this.repository.getUserChats(userId);
  }

  async findById(chatId: string): Promise<IChat | null> {
    return this.repository.findById(chatId);
  }
}
