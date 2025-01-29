import { injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IBookmarkRepository } from "../core/interfaces/repositories/IBookmarnRepository";
import { IBookmark, BookmarkModel } from "../models/bookmarks.model";

@injectable()
export class BookmarkRepository
  extends BaseRepository<IBookmark>
  implements IBookmarkRepository
{
  constructor() {
    super(BookmarkModel);
  }

  async getBookmarks(userId: string): Promise<IBookmark[]> {
    return await this.find({ userId });
  }
}
