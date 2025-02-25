import { IChat } from "../../../models/chat.model";

export interface IChatService {
  createNewChat(members: string[]): Promise<IChat>;
  getAllChats(userId: string): Promise<IChat[]>;
}
