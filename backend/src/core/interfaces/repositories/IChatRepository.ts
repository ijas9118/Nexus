import { IChat } from '../../../models/chat.model';
import { BaseRepository } from '../../abstracts/base.repository';

export interface IChatRepository extends BaseRepository<IChat> {
  createNewChat(members: string[]): Promise<IChat>;
  getAllChats(userId: string): Promise<IChat[]>;
}
