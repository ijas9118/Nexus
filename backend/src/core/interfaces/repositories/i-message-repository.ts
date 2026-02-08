import type { IMessage } from '@/models/message.model';

import type { IBaseRepository } from './i-base-repository';

export interface IMessageRepository extends IBaseRepository<IMessage> {
  getMessagesByChat: (chatId: string, chatType: 'Chat' | 'Group') => Promise<IMessage[]>;
  getUnreadCount: (userId: string, chatId: string, chatType: 'Chat' | 'Group') => Promise<number>;
  markMessagesAsRead: (chatId: string, chatType: 'Chat' | 'Group', userId: string) => Promise<void>;
  addReaction: (messageId: string, userId: string, reaction: string) => Promise<IMessage | null>;
  removeReaction: (messageId: string, userId: string) => Promise<IMessage | null>;
  softDeleteMessage: (messageId: string) => Promise<IMessage | null>;
}
