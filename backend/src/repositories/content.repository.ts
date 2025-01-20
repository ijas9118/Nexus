import { BaseRepository } from "../core/abstracts/base.repository";
import { IContentRepository } from "../core/interfaces/repositories/IContentRepository";
import ContentModel, { IContent } from "../models/content.model";

export class ContentRepository
  extends BaseRepository<IContent>
  implements IContentRepository
{
  constructor() {
    super(ContentModel);
  }

  async addLike(contentId: string, userId: string): Promise<IContent | null> {
    return this.addToSet(contentId, "likes", userId);
  }

  async removeLike(contentId: string, userId: string): Promise<IContent | null> {
    return this.pull(contentId, "likes", userId);
  }
}
