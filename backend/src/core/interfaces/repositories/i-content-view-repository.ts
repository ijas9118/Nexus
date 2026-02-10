import type { BaseRepository } from "@/core/abstracts/base.repository";
import type { IContentView } from "@/models/content/content-view.model";

export interface IContentViewRepository extends BaseRepository<IContentView> {
  hasUserViewedContent: (userId: string, contentId: string) => Promise<boolean>;
  createView: (userId: string, contentId: string) => Promise<IContentView>;
  getViewCount: (contentId: string) => Promise<number>;
}
