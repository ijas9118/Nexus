import type { IContent } from "@/models/content/content.model";

export interface IBookmarkService {
  toggleBookmark: (contentId: string, userId: string) => Promise<{ status: boolean }>;
  getBookmarks: (userId: string) => Promise<IContent[]>;
}
