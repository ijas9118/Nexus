import { inject, injectable } from 'inversify';
import { IBookmarkService } from '../core/interfaces/services/IBookmarkService';
import { TYPES } from '../di/types';
import mongoose from 'mongoose';
import { IBookmarkRepository } from '../core/interfaces/repositories/IBookmarnRepository';
import { IContentRepository } from '../core/interfaces/repositories/IContentRepository';
import CustomError from '../utils/CustomError';
import { IBookmark } from '../models/bookmarks.model';
import { BaseService } from '../core/abstracts/base.service';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class BookmarkService extends BaseService<IBookmark> implements IBookmarkService {
  constructor(
    @inject(TYPES.BookmarkRepository) private bookmarkRepository: IBookmarkRepository,
    @inject(TYPES.ContentRepository) private contentRepository: IContentRepository
  ) {
    super(bookmarkRepository);
  }

  // Toggle bookmark for a content
  async toggleBookmark(contentId: string, userId: string): Promise<{ status: boolean }> {
    const content = await this.contentRepository.find({ _id: contentId });
    if (!content) {
      throw new CustomError('Content not found', StatusCodes.NOT_FOUND);
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
      bookmark.contentIds = bookmark.contentIds.filter((id) => !id.equals(contentIdObject));
      await this.bookmarkRepository.updateBookmark(userIdObject, bookmark.contentIds);
      return { status: false };
    } else {
      bookmark.contentIds.push(contentIdObject);
      await this.bookmarkRepository.updateBookmark(userIdObject, bookmark.contentIds);
      return { status: true };
    }
  }

  // Get all bookmarks of a user
  async getBookmarks(userId: string): Promise<IBookmark[]> {
    const bookmarks = await this.bookmarkRepository.getBookmarks(userId);
    return bookmarks;
  }
}
