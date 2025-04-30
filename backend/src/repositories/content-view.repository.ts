import { BaseRepository } from '@/core/abstracts/base.repository';
import { IContentViewRepository } from '@/core/interfaces/repositories/IContentViewRepository';
import ContentViewModel, { IContentView } from '@/models/content-view.model';
import { injectable } from 'inversify';

@injectable()
export class ContentViewRepository
  extends BaseRepository<IContentView>
  implements IContentViewRepository
{
  constructor() {
    super(ContentViewModel);
  }

  async hasUserViewedContent(userId: string, contentId: string): Promise<boolean> {
    return !!(await this.model.findOne({ userId, contentId }));
  }

  async createView(userId: string, contentId: string): Promise<IContentView> {
    return this.model.create({ userId, contentId });
  }

  async getViewCount(contentId: string): Promise<number> {
    return this.model.countDocuments({ contentId });
  }
}
