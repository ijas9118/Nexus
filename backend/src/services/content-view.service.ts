import { inject, injectable } from "inversify";

import type { IContentRepository } from "@/core/interfaces/repositories/i-content-repository";
import type { IContentViewRepository } from "@/core/interfaces/repositories/i-content-view-repository";
import type { IContentViewService } from "@/core/interfaces/services/i-content-view-service";

import { TYPES } from "@/di/types";

@injectable()
export class ContentViewService implements IContentViewService {
  constructor(
    @inject(TYPES.ContentViewRepository) private viewRepo: IContentViewRepository,
    @inject(TYPES.ContentRepository) private contentRepo: IContentRepository,
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
