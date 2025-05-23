import { SearchCriteria, SearchResultItem } from '@/core/types/search';
import { IContent } from '../../../models/content.model';
import { BaseRepository } from '../../abstracts/base.repository';
import { UserRole } from '@/core/types/UserTypes';

export interface IContentRepository extends BaseRepository<IContent> {
  findContent(contentId: string, role: string, userId: string): Promise<IContent | null>;
  getFeedContents(userId: string, page: number, limit: number): Promise<IContent[]>;
  getPosts(): Promise<IContent[]>;
  verifyContent(contentId: string): Promise<IContent | null>;
  getFollowingUsersContents(userId: string): Promise<IContent[]>;
  getContentCount(): Promise<number>;
  getUserContents(userId: string): Promise<IContent[] | null>;
  incrementViewCount(contentId: string): Promise<void>;
  search(criteria: SearchCriteria): Promise<SearchResultItem[]>;
  getSquadContents(squadId: string, role: UserRole, userId: string): Promise<any[]>;
  countContents(): Promise<number>;
  countContentsBefore(date: Date): Promise<number>;
}
