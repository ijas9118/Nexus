import { IContent } from '../../../models/content.model';
import { Express } from 'express';

export interface IContentService {
  createContent(
    contentData: Partial<IContent>,
    thumbnailFile?: Express.Multer.File,
    videoFile?: Express.Multer.File
  ): Promise<IContent>;
  getContentById(id: string, role: string, userId: string): Promise<IContent | null>;
  getAllContent(userId: string, page: number, limit: number): Promise<IContent[]>;
  getPosts(): Promise<IContent[]>;
  verifyContent(contentId: string): Promise<IContent | null>;
  getFollowingUsersContents(userId: string): Promise<IContent[]>;
  getContentCount(): Promise<number>;
}
