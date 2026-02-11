import type mongoose from "mongoose";

import type { BaseRepository } from "@/core/abstracts/base.repository";
import type { IContent } from "@/models/content/content.model";
import type { IBookmark } from "@/models/social/bookmarks.model";

export interface IBookmarkRepository extends BaseRepository<IBookmark> {
  getBookmarks: (userId: string) => Promise<IContent[]>;
  updateBookmark: (
    userId: mongoose.Types.ObjectId,
    contentIds: mongoose.Types.ObjectId[],
  ) => Promise<void>;
}
