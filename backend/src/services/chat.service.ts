import { inject, injectable } from 'inversify';

import type { IChatRepository } from '@/core/interfaces/repositories/i-chat-repository';
import type { IChatService } from '@/core/interfaces/services/i-chat-service';
import type { IConnectionService } from '@/core/interfaces/services/i-connection-service';
import type { IChat } from '@/models/chat.model';

import { TYPES } from '@/di/types';
import { ChatModel } from '@/models/chat.model';

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject(TYPES.ChatRepository) protected repository: IChatRepository,
    @inject(TYPES.ConnectionService) private connectionService: IConnectionService
  ) {}

  async createChat(userId: string, otherUserId: string): Promise<IChat> {
    const isConnected = await this.connectionService.isConnected(userId, otherUserId);
    if (!isConnected) {
      throw new Error('Users must be connected to start a chat');
    }

    // Check if chat already exists
    let chat = await this.repository.findChatBetweenUsers(userId, otherUserId);
    if (!chat) {
      chat = await this.repository.create({ participants: [userId, otherUserId] });
    }
    const populatedChat = await ChatModel.findById(chat._id).populate(
      'participants',
      'name username profilePic'
    );

    if (!populatedChat) throw new Error('Failed to fetch populated chat');

    return populatedChat;
  }

  async getUserChats(userId: string): Promise<IChat[]> {
    return this.repository.getUserChats(userId);
  }

  async findById(chatId: string): Promise<IChat | null> {
    return this.repository.findById(chatId);
  }
}
