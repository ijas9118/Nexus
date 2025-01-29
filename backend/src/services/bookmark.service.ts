import { inject, injectable } from "inversify";
import { IBookmarkService } from "../core/interfaces/services/IBookmarkService";
import { BookmarkRepository } from "../repositories/bookmark.repository";
import { ContentRepository } from "../repositories/content.repository";
import { TYPES } from "../di/types";

@injectable()
export class BookmarkService implements IBookmarkService {
  constructor(
    @inject(TYPES.BookmarkRepository) private bookmarkRepository: BookmarkRepository,
    @inject(TYPES.ContentRepository) private contentRepository: ContentRepository
  ) {}

  async toggleBookmark(contentId: string, userId: string): Promise<{ status: boolean }> {
    const content = await this.contentRepository.findById(contentId);
    if (!content) throw new Error("Content not found");

    const bookmark = await this.bookmarkRepository.findOne({ contentId, userId });
    if (bookmark) {
      await this.bookmarkRepository.deleteOne({ contentId, userId });
    } else {
      await this.bookmarkRepository.create({ contentId, userId });
    }

    return { status: bookmark ? false : true };
  }

  async getBookmarks(userId: string): Promise<Set<string>> {
    const bookmarked = await this.bookmarkRepository.getBookmarks(userId);
    const contentId = new Set(
      bookmarked.map((bookmark) => bookmark.contentId.toString())
    );

    return contentId;
  }
}
