import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";

import type { IContent } from "@/models/content.model";

import type { IBookmarkRepository } from "../core/interfaces/repositories/i-bookmarn-repository";
import type { IContentRepository } from "../core/interfaces/repositories/i-content-repository";
import type { IBookmarkService } from "../core/interfaces/services/i-bookmark-service";

import { TYPES } from "../di/types";
import CustomError from "../utils/custom-error";

@injectable()
export class BookmarkService implements IBookmarkService {
  constructor(
    @inject(TYPES.BookmarkRepository) private bookmarkRepository: IBookmarkRepository,
    @inject(TYPES.ContentRepository) private contentRepository: IContentRepository,
  ) {}

  // Toggle bookmark for a content
  async toggleBookmark(contentId: string, userId: string): Promise<{ status: boolean }> {
    const content = await this.contentRepository.find({ _id: contentId });
    if (!content) {
      throw new CustomError("Content not found", StatusCodes.NOT_FOUND);
    }

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
      bookmark.contentIds = bookmark.contentIds.filter(id => !id.equals(contentIdObject));
      await this.bookmarkRepository.updateBookmark(userIdObject, bookmark.contentIds);
      return { status: false };
    }
    else {
      bookmark.contentIds.push(contentIdObject);
      await this.bookmarkRepository.updateBookmark(userIdObject, bookmark.contentIds);
      return { status: true };
    }
  }

  // Get all bookmarks of a user
  async getBookmarks(userId: string): Promise<IContent[]> {
    const bookmarks = await this.bookmarkRepository.getBookmarks(userId);
    return bookmarks;
  }
}
