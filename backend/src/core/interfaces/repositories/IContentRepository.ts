import { IContent } from "../../../models/content.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface IContentRepository extends BaseRepository<IContent> {
  findContent(contentId: string): Promise<IContent | null>;
  getFeedContents(userId: string): Promise<IContent[]>;
  getPosts(): Promise<IContent[]>;
  verifyContent(contentId: string): Promise<IContent | null>;
}
