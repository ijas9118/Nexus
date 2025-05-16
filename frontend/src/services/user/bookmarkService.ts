import { handleApi } from "@/utils/handleApi";
import api from "../api";
import { CONTENT_ROUTES } from "@/utils/constants";

const BookmarkService = {
  // Bookmark a content
  bookmarkContent: (contentId: string) =>
    handleApi(() => api.post(`${CONTENT_ROUTES.POST}/${contentId}/bookmark`)),

  // Get all bookmarked content
  getAllBookmarks: () =>
    handleApi(() => api.get<any[]>(CONTENT_ROUTES.BOOKMARKS)),
};

export default BookmarkService;
