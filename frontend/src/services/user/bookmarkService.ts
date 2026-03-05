import type { Content } from "@/types/content";
import { CONTENT_ROUTES } from "@/utils/constants";
import { handleApi } from "@/utils/handleApi";

import api from "../api";

const BookmarkService = {
  // Bookmark a content
  bookmarkContent: (contentId: string) =>
    handleApi(() => api.post(`${CONTENT_ROUTES.POST}/${contentId}/bookmark`)),

  // Get all bookmarked content
  getAllBookmarks: () =>
    handleApi(() => api.get<Content[]>(CONTENT_ROUTES.BOOKMARKS)),
};

export default BookmarkService;
