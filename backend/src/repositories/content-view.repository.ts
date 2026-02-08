import { injectable } from 'inversify';

import type { IContentViewRepository } from '@/core/interfaces/repositories/i-content-view-repository';
import type { IContentView } from '@/models/content-view.model';

import { BaseRepository } from '@/core/abstracts/base.repository';
import ContentViewModel from '@/models/content-view.model';

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
