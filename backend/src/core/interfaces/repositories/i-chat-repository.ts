import type { IChat } from "@/models/communication/chat.model";

import type { IBaseRepository } from "./i-base-repository";

export interface IChatRepository extends IBaseRepository<IChat> {
  findChatBetweenUsers: (user1Id: string, user2Id: string) => Promise<IChat | null>;
  getUserChats: (userId: string) => Promise<IChat[]>;
}
