import { IContentRepository } from '@/core/interfaces/repositories/IContentRepository';
import { IContentViewRepository } from '@/core/interfaces/repositories/IContentViewRepository';
import { IContentViewService } from '@/core/interfaces/services/IContentViewService';
import { TYPES } from '@/di/types';
import { inject, injectable } from 'inversify';

@injectable()
export class ContentViewService implements IContentViewService {
  constructor(
    @inject(TYPES.ContentViewRepository) private viewRepo: IContentViewRepository,
    @inject(TYPES.ContentRepository) private contentRepo: IContentRepository
  ) {}

  async handleContentView(userId: string, contentId: string): Promise<void> {
    const alreadyViewed = await this.viewRepo.hasUserViewedContent(userId, contentId);
    if (!alreadyViewed) {
      await this.viewRepo.createView(userId, contentId);
      await this.contentRepo.incrementViewCount(contentId);
    }
  }

  async getContentViewCount(contentId: string): Promise<number> {
    return this.viewRepo.getViewCount(contentId);
  }
}
