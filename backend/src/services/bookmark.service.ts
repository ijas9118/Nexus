import { inject, injectable } from "inversify";
import { IBookmarkService } from "../core/interfaces/services/IBookmarkService";
import { BookmarkRepository } from "../repositories/bookmark.repository";
import { ContentRepository } from "../repositories/content.repository";
import { TYPES } from "../di/types";
import mongoose from "mongoose";

@injectable()
export class BookmarkService implements IBookmarkService {
  constructor(
    @inject(TYPES.BookmarkRepository) private bookmarkRepository: BookmarkRepository,
    @inject(TYPES.ContentRepository) private contentRepository: ContentRepository
  ) {}

  async toggleBookmark(contentId: string, userId: string): Promise<{ status: boolean }> {
    const content = await this.contentRepository.findContent(contentId);
    if (!content) throw new Error("Content not found");

    const contentIdObject = new mongoose.Types.ObjectId(contentId);
    const userIdObject = new mongoose.Types.ObjectId(userId);

    let bookmark = await this.bookmarkRepository.findOne({ userId: userIdObject });

    if (!bookmark) {
      bookmark = await this.bookmarkRepository.create({
        userId: userIdObject,
        contentIds: [contentIdObject],
      });
      return { status: true };
    }

    const isBookmarked = bookmark.contentIds.includes(contentIdObject);

    if (isBookmarked) {
      bookmark.contentIds = bookmark.contentIds.filter(
        (id) => !id.equals(contentIdObject)
      );
      await bookmark.save();
      return { status: false };
    } else {
      bookmark.contentIds.push(contentIdObject);
      await bookmark.save();
      return { status: true };
    }
  }

  async getBookmarks(userId: string): Promise<any[]> {
    const bookmarks = await this.bookmarkRepository.getBookmarks(userId);
    return bookmarks;
  }
}
