import { IChat } from '@/models/chat.model';

export interface IChatService {
  createChat(userId: string, otherUserId: string): Promise<IChat>;
  getUserChats(userId: string): Promise<IChat[]>;
}
