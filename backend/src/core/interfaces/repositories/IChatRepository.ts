import { IChat } from '@/models/chat.model';
import { IBaseRepository } from './IBaseRepository';

export interface IChatRepository extends IBaseRepository<IChat> {
  findChatBetweenUsers(user1Id: string, user2Id: string): Promise<IChat | null>;
  getUserChats(userId: string): Promise<IChat[]>;
}
