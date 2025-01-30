import { injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IBookmarkRepository } from "../core/interfaces/repositories/IBookmarnRepository";
import { IBookmark, BookmarkModel } from "../models/bookmarks.model";
import mongoose from "mongoose";

@injectable()
export class BookmarkRepository
  extends BaseRepository<IBookmark>
  implements IBookmarkRepository
{
  constructor() {
    super(BookmarkModel);
  }

  async save(bookmark: IBookmark): Promise<IBookmark> {
    return bookmark.save();
  }

  async getBookmarks(userId: string): Promise<IBookmark[]> {
    const userIdObject = new mongoose.Types.ObjectId(userId);

    const bookmarkedContents = await this.model.aggregate([
      {
        $match: {
          userId: userIdObject,
        },
      },
      {
        $unwind: "$contentIds",
      },
      {
        $lookup: {
          from: "contents",
          localField: "contentIds",
          foreignField: "_id",
          as: "content",
        },
      },
      {
        $unwind: "$content",
      },
    ]);

    console.log(bookmarkedContents);

    return bookmarkedContents;
  }
}
