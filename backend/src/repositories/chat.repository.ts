import { BaseRepository } from '@/core/abstracts/base.repository';
import { IChatRepository } from '@/core/interfaces/repositories/IChatRepository';
import { ChatModel, IChat } from '@/models/chat.model';
import { injectable } from 'inversify';

@injectable()
export class ChatRepository extends BaseRepository<IChat> implements IChatRepository {
  constructor() {
    super(ChatModel);
  }

  async findChatBetweenUsers(user1Id: string, user2Id: string): Promise<IChat | null> {
    return this.model.findOne({
      participants: { $all: [user1Id, user2Id], $size: 2 },
    });
  }

  async getUserChats(userId: string): Promise<IChat[]> {
    return this.model.find({ participants: userId }).populate({
      path: 'participants',
      select: 'name username profilePic',
    });
  }
}
