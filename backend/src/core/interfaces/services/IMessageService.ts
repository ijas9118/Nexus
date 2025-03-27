import { IMessage } from '../../../models/message.model';

export interface IMessageService {
  getAllMessages(user1: string, user2: string): Promise<IMessage[]>;
  getUsersWithChats(userId: string): Promise<any[]>;
}
