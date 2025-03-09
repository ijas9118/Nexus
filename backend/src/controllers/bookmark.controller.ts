import { Response } from 'express';
import { IBookmarkController } from '../core/interfaces/controllers/IBookmarkController';
import { CustomRequest } from '../core/types/CustomRequest';
import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import { IBookmarkService } from '../core/interfaces/services/IBookmarkService';
import asyncHandler from 'express-async-handler';
import CustomError from '../utils/CustomError';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class BookmarkController implements IBookmarkController {
  constructor(@inject(TYPES.BookmarkService) private bookmarkService: IBookmarkService) {}

  // Toggle a bookmark by content ID
  toggleBookmark = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const { id: contentId } = req.params;
    const userId = req.user?._id;
    if (!userId) {throw new CustomError('User is not authenticated', StatusCodes.UNAUTHORIZED);}

    const result = await this.bookmarkService.toggleBookmark(contentId, userId);
    res.status(StatusCodes.OK).json({ ...result });
  });

  // Get all bookmarks for a user
  getAllBookmarks = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    if (!req.user) {throw new CustomError('User is not authenticated', StatusCodes.UNAUTHORIZED);}

    const bookmarkedContents = await this.bookmarkService.getBookmarks(req.user._id);
    res.status(StatusCodes.OK).json(bookmarkedContents);
  });
}
