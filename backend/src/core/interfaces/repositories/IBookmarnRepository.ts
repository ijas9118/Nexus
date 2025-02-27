import mongoose from "mongoose";
import { IBookmark } from "../../../models/bookmarks.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface IBookmarkRepository extends BaseRepository<IBookmark> {
  getBookmarks(userId: string): Promise<IBookmark[]>;
  updateBookmark(
    userId: mongoose.Types.ObjectId,
    contentIds: mongoose.Types.ObjectId[]
  ): Promise<void>;
}
