import api from "../api";
import { handleApi } from "@/utils/handleApi";
import { CONTENT_ROUTES } from "@/utils/constants";

const ContentService = {
  // Add new content
  addContent: async (formData: FormData) => {
    try {
      const response = await api.post("/content/posts", formData, {
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
      api.get<any>(`${CONTENT_ROUTES.POST}?page=${pageParam}&limit=4`),
    ),

  // Get single content by ID
  getContent: (id: string) =>
    handleApi(() => api.get<any>(`${CONTENT_ROUTES.POST}/${id}`)),

  // Get contents from followed users
  getFollowingUsersContents: () =>
    handleApi(() => api.get<any>(CONTENT_ROUTES.GET_FOLLOWING_POSTS)),

  // Get user's content history
  getHistory: () => handleApi(() => api.get<any>(CONTENT_ROUTES.GET_HISTORY)),

  // Remove a content from history
  removeFromHistory: (contentId: string) =>
    handleApi(() =>
      api.post<any>(CONTENT_ROUTES.REMOVE_FROM_HISTORY, { contentId }),
    ),
};

export default ContentService;
