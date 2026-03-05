import type { Content, IHistoryItem } from "@/types/content";
import { CONTENT_ROUTES } from "@/utils/constants";
import { handleApi } from "@/utils/handleApi";

import api from "../api";

const ContentService = {
  // Add new content
  addContent: async (
    formData: FormData,
  ): Promise<{ success: boolean; message: string; contentId: string }> => {
    try {
      const response = await api.post<{
        success: boolean;
        message: string;
        contentId: string;
      }>(CONTENT_ROUTES.POST, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch {
      throw new Error("Failed to create content");
    }
  },

  // Get paginated content
  getAllContent: ({ pageParam = 1 }: { pageParam?: number }) =>
    handleApi(() =>
      api.get<{ contents: Content[]; nextPage: number | null }>(
        `${CONTENT_ROUTES.POST}?page=${pageParam}&limit=4`,
      ),
    ),

  // Get single content by ID
  getContent: (id: string) =>
    handleApi(() => api.get<Content>(`${CONTENT_ROUTES.POST}/${id}`)),

  // Get contents from followed users
  getFollowingUsersContents: () =>
    handleApi(() => api.get<Content[]>(CONTENT_ROUTES.GET_FOLLOWING_POSTS)),

  // Get user's content history
  getHistory: () =>
    handleApi(() => api.get<IHistoryItem[]>(CONTENT_ROUTES.GET_HISTORY)),

  // Remove a content from history
  removeFromHistory: (contentId: string) =>
    handleApi(() =>
      api.post<{ message: string }>(CONTENT_ROUTES.REMOVE_FROM_HISTORY, {
        contentId,
      }),
    ),
};

export default ContentService;
