import { IContent } from '../../../models/content.model';

export interface IContentService {
  createContent(contentData: Partial<IContent>): Promise<IContent>;
  getContentById(id: string): Promise<IContent | null>;
  getAllContent(userId: string): Promise<IContent[]>;
  getPosts(): Promise<IContent[]>;
  verifyContent(contentId: string): Promise<IContent | null>;
  getFollowingUsersContents(userId: string): Promise<IContent[]>;
}
