import { inject, injectable } from "inversify";

import type { IContentRepository } from "@/core/interfaces/repositories/i-content-repository";
import type { IContentViewRepository } from "@/core/interfaces/repositories/i-content-view-repository";
import type { IContentViewService } from "@/core/interfaces/services/i-content-view-service";

import { TYPES } from "@/di/types";

@injectable()
export class ContentViewService implements IContentViewService {
  constructor(
    @inject(TYPES.ContentViewRepository) private _viewRepo: IContentViewRepository,
    @inject(TYPES.ContentRepository) private _contentRepo: IContentRepository,
  ) {}

  async handleContentView(userId: string, contentId: string): Promise<void> {
    const alreadyViewed = await this._viewRepo.hasUserViewedContent(userId, contentId);
    if (!alreadyViewed) {
      await this._viewRepo.createView(userId, contentId);
      await this._contentRepo.incrementViewCount(contentId);
    }
  }

  async getContentViewCount(contentId: string): Promise<number> {
    return this._viewRepo.getViewCount(contentId);
  }
}
