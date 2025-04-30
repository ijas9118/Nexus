import { IContent } from '../../../models/content.model';
import { BaseRepository } from '../../abstracts/base.repository';

export interface IContentRepository extends BaseRepository<IContent> {
  findContent(contentId: string, role: string, userId: string): Promise<IContent | null>;
  getFeedContents(userId: string, page: number, limit: number): Promise<IContent[]>;
  getPosts(): Promise<IContent[]>;
  verifyContent(contentId: string): Promise<IContent | null>;
  getFollowingUsersContents(userId: string): Promise<IContent[]>;
  getContentCount(): Promise<number>;
  getUserContents(userId: string): Promise<IContent[] | null>;
  incrementViewCount(contentId: string): Promise<void>;
}
