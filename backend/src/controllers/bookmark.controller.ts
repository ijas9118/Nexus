import { Response } from "express";
import { IBookmarkController } from "../core/interfaces/controllers/IBookmarkController";
import { CustomRequest } from "../core/types/CustomRequest";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IBookmarkService } from "../core/interfaces/services/IBookmarkService";
import asyncHandler from "express-async-handler";
import CustomError from "../utils/CustomError";

@injectable()
export class BookmarkController implements IBookmarkController {
  constructor(@inject(TYPES.BookmarkService) private bookmarkService: IBookmarkService) {}

  // Toggle a bookmark by content ID
  toggleBookmark = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
      try {
        let { id: contentId } = req.params;
        const userId = req.user?._id;
        if (!userId) throw new CustomError("User is not authenticated", 401);

        const result = await this.bookmarkService.toggleBookmark(contentId, userId);
        res.status(200).json({ ...result });
      } catch (error) {
        res.status(500).json({ message: "Error toggling like", error });
      }
    }
  );

  // Get all bookmarks for a user
  getAllBookmarks = asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void> => {
      if (!req.user) throw new CustomError("User is not authenticated", 401);

      const bookmarkedContents = await this.bookmarkService.getBookmarks(req.user._id);
      res.status(200).json(bookmarkedContents);
    }
  );
}
