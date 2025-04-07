import { BaseService } from '@/core/abstracts/base.service';
import { IChat } from '@/models/chat.model';

export interface IChatService extends BaseService<IChat> {
  createChat(userId: string, otherUserId: string): Promise<IChat>;
  getUserChats(userId: string): Promise<IChat[]>;
}
