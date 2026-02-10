import type { IChat } from "@/models/communication/chat.model";

export interface IChatService {
  createChat: (userId: string, otherUserId: string) => Promise<IChat>;
  getUserChats: (userId: string) => Promise<IChat[]>;
  findById: (chatId: string) => Promise<IChat | null>;
}
