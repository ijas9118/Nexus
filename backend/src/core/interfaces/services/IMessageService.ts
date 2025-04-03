import { IMessage } from '../../../models/message.model';
import { Express } from 'express';

export interface IMessageService {
  getAllMessages(user1: string, user2: string): Promise<IMessage[]>;
  getUsersWithChats(userId: string): Promise<any[]>;
  uploadFile(file: Express.Multer.File): Promise<any>;
  createMessage(message: Partial<IMessage>): Promise<IMessage>;
  getMessageById(messageId: string, isGroup: boolean): Promise<IMessage | null>;
}
