import { IContent } from "../../../models/content.model";

export interface IContentService {
  createContent(contentData: Partial<IContent>): Promise<IContent>;
  getContentById(id: string): Promise<IContent | null>;
  getAllContent(): Promise<IContent[]>;
  likeContent(contentId: string, userId: string): Promise<IContent | null>;
  unlikeContent(contentId: string, userId: string): Promise<IContent | null>;
}
