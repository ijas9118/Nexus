import { injectable } from "inversify";

import type { IChatRepository } from "@/core/interfaces/repositories/i-chat-repository";
import type { IChat } from "@/models/communication/chat.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { ChatModel } from "@/models/communication/chat.model";

@injectable()
export class ChatRepository extends BaseRepository<IChat> implements IChatRepository {
  constructor() {
    super(ChatModel);
  }

  async findChatBetweenUsers(user1Id: string, user2Id: string): Promise<IChat | null> {
    return this._model.findOne({
      participants: { $all: [user1Id, user2Id], $size: 2 },
    });
  }

  async getUserChats(userId: string): Promise<IChat[]> {
    return this._model
      .find({ participants: userId })
      .populate({
        path: "participants",
        select: "name username profilePic",
      })
      .sort({ updatedAt: -1 });
  }
}
