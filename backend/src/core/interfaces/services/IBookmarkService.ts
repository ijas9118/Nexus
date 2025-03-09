import { IBookmark } from '../../../models/bookmarks.model';

export interface IBookmarkService {
  toggleBookmark(contentId: string, userId: string): Promise<{ status: boolean }>;
  getBookmarks(userId: string): Promise<IBookmark[]>;
}
