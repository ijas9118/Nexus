import { Response } from "express";
import { IBookmarkController } from "../core/interfaces/controllers/IBookmarkController";
import { BookmarkService } from "../services/bookmark.service";
import { CustomRequest } from "../core/types/CustomRequest";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";

@injectable()
export class BookmarkController implements IBookmarkController {
  constructor(@inject(TYPES.BookmarkService) private bookmarkService: BookmarkService) {}

  async toggleBookmark(req: CustomRequest, res: Response): Promise<void> {
    try {
      let { id: contentId } = req.params;
      const userId = req.user?._id;
      if (!userId) {
        res.status(400).json({ message: "User is not authenticated" });
        return;
      }
      const result = await this.bookmarkService.toggleBookmark(contentId, userId);
      res.status(200).json({ ...result });
    } catch (error) {
      res.status(500).json({ message: "Error toggling like", error });
    }
  }

  async getAllBookmarks(req: CustomRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(400).json({ message: "User is not authenticated" });
        return;
      }

      const bookmarkedContents = await this.bookmarkService.getBookmarks(req.user?._id);

      res.status(200).json(bookmarkedContents);
    } catch (error) {
      res.status(400).json({ message: "Failed to get contents", error });
    }
  }
}
