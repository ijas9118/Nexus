import { IContent } from "../../../models/content.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface IContentRepository extends BaseRepository<IContent> {
  getFeedContents(userId: string): Promise<IContent[]>;
}
