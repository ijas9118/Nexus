export interface IBookmarkService {
  toggleBookmark(contentId: string, userId: string): Promise<{ status: boolean }>;
  getBookmarks(userId: string): Promise<Set<string>>;
}
