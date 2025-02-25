import mongoose from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IChatRepository } from "../core/interfaces/repositories/IChatRepository";
import ChatModel, { IChat } from "../models/chat.model";
import { injectable } from "inversify";

@injectable()
export class ChatRepository extends BaseRepository<IChat> implements IChatRepository {
  constructor() {
    super(ChatModel);
  }

  createNewChat(members: string[]): Promise<IChat> {
    const objectIdMembers = members.map((member) => new mongoose.Types.ObjectId(member));
    return this.create({ members: objectIdMembers });
  }

  getAllChats(userId: string): Promise<IChat[]> {
    return this.find({ members: { $in: [new mongoose.Types.ObjectId(userId)] } });
  }
}
