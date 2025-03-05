import { inject, injectable } from 'inversify';
import { BaseService } from '../core/abstracts/base.service';
import { IChatRepository } from '../core/interfaces/repositories/IChatRepository';
import { IChatService } from '../core/interfaces/services/IChatService';
import { IChat } from '../models/chat.model';
import { TYPES } from '../di/types';

@injectable()
export class ChatService extends BaseService<IChat> implements IChatService {
  constructor(@inject(TYPES.ChatRepository) private chatRepository: IChatRepository) {
    super(chatRepository);
  }

  createNewChat(members: string[]): Promise<IChat> {
    return this.chatRepository.createNewChat(members);
  }

  getAllChats(userId: string): Promise<IChat[]> {
    return this.chatRepository.getAllChats(userId);
  }
}
