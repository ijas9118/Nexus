import { Request, Response } from 'express';
import { IBookmarkController } from '../core/interfaces/controllers/IBookmarkController';

import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import { IBookmarkService } from '../core/interfaces/services/IBookmarkService';
import asyncHandler from 'express-async-handler';
import CustomError from '../utils/CustomError';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class BookmarkController implements IBookmarkController {
  constructor(@inject(TYPES.BookmarkService) private _bookmarkService: IBookmarkService) {}

  // Toggle a bookmark by content ID
  toggleBookmark = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id: contentId } = req.params;
    const userId = req.user?._id;
    if (!userId) {
      throw new CustomError('User is not authenticated', StatusCodes.UNAUTHORIZED);
    }

    await this._bookmarkService.toggleBookmark(contentId, userId);
    res.status(StatusCodes.OK).json({ success: true });
  });

  // Get all bookmarks for a user
  getAllBookmarks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const bookmarkedContents = await this._bookmarkService.getBookmarks(req.user?._id as string);
    res.status(StatusCodes.OK).json(bookmarkedContents);
  });
}
