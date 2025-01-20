import { IContent } from "../../../models/content.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface IContentRepository extends BaseRepository<IContent> {
  addLike(contentId: string, userId: string): Promise<IContent | null>;
  removeLike(contentId: string, userId: string): Promise<IContent | null>;
}
