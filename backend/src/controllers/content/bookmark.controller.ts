import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IBookmarkController } from "@/core/interfaces/controllers/i-bookmark-controller";
import type { IBookmarkService } from "@/core/interfaces/services/i-bookmark-service";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { BOOKMARK_MESSAGES } = MESSAGES;

@injectable()
export class BookmarkController implements IBookmarkController {
  constructor(@inject(TYPES.BookmarkService) private _bookmarkService: IBookmarkService) {}

  // Toggle a bookmark by content ID
  toggleBookmark = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id: contentId } = req.params;
    const userId = req.user?._id;
    if (!userId) {
      throw new CustomError(BOOKMARK_MESSAGES.AUTH_REQUIRED, StatusCodes.UNAUTHORIZED);
    }

    await this._bookmarkService.toggleBookmark(contentId as string, userId);
    res.status(StatusCodes.OK).json({ success: true });
  });

  // Get all bookmarks for a user
  getAllBookmarks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const bookmarkedContents = await this._bookmarkService.getBookmarks(req.user?._id as string);
    res.status(StatusCodes.OK).json(bookmarkedContents);
  });
}
