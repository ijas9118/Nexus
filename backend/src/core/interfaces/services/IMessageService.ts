import { IMessage } from '../../../models/message.model';

export interface IMessageService {
  createNewMessage(data: { chatId: string; sender: string; text: string }): Promise<IMessage>;
  getAllMessages(user1: string, user2: string): Promise<IMessage[]>;
  getUsersWithChats(userId: string): Promise<any[]>;
}
