import type mongoose from "mongoose";

import type { IContent } from "@/models/content.model";

import type { IBookmark } from "../../../models/bookmarks.model";
import type { BaseRepository } from "../../abstracts/base.repository";

export interface IBookmarkRepository extends BaseRepository<IBookmark> {
  getBookmarks: (userId: string) => Promise<IContent[]>;
  updateBookmark: (
    userId: mongoose.Types.ObjectId,
    contentIds: mongoose.Types.ObjectId[],
  ) => Promise<void>;
}
