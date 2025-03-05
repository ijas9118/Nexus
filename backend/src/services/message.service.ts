import { inject, injectable } from 'inversify';
import { BaseService } from '../core/abstracts/base.service';
import { TYPES } from '../di/types';
import { IMessage } from '../models/message.model';
import { IMessageRepository } from '../core/interfaces/repositories/IMessageRepository';
import { IMessageService } from '../core/interfaces/services/IMessageService';
import { io } from '../server';

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
    io.to(data.chatId).emit('receiveMessage', message); // Emit the event
    return message;
  };

  getAllMessages = async (chatId: string): Promise<IMessage[]> => {
    return await this.messageRepository.getAllMessages(chatId);
  };
}
