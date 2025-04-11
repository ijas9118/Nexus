import { BaseService } from '@/core/abstracts/base.service';
import { IChatRepository } from '@/core/interfaces/repositories/IChatRepository';
import { IChatService } from '@/core/interfaces/services/IChatService';
import { IConnectionService } from '@/core/interfaces/services/IConnectionService';
import { TYPES } from '@/di/types';
import { ChatModel, IChat } from '@/models/chat.model';
import { inject, injectable } from 'inversify';

@injectable()
export class ChatService extends BaseService<IChat> implements IChatService {
  constructor(
    @inject(TYPES.ChatRepository) protected repository: IChatRepository,
    @inject(TYPES.ConnectionService) private connectionService: IConnectionService
  ) {
    super(repository);
  }

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
}
