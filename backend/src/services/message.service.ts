import { inject, injectable } from 'inversify';
import { BaseService } from '../core/abstracts/base.service';
import { TYPES } from '../di/types';
import { IMessage } from '../models/message.model';
import { IMessageRepository } from '../core/interfaces/repositories/IMessageRepository';
import { IMessageService } from '../core/interfaces/services/IMessageService';

@injectable()
export class MessageService extends BaseService<IMessage> implements IMessageService {
  constructor(@inject(TYPES.MessageRepository) private messageRepository: IMessageRepository) {
    super(messageRepository);
  }

  createNewMessage = async (data: {
    chatId: string;
    sender: string;
    text: string;
  }): Promise<IMessage> => {
    const message = await this.messageRepository.createNewMessage(data);
    return message;
  };

  getAllMessages = async (user1: string, user2: string): Promise<IMessage[]> => {
    return await this.messageRepository.getAllMessages(user1, user2);
  };

  getUsersWithChats = async (userId: string): Promise<any[]> => {
    return await this.messageRepository.getUsersWithChats(userId);
  };
}
