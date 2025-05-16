import axios, { AxiosError } from "axios";
import api from "../api";
import { handleApi } from "@/utils/handleApi";
import { CONTENT_ROUTES } from "@/utils/constants";

export const uploadFiles = async (
  uploadUrl: string,
  formData: FormData,
): Promise<string | undefined> => {
  try {
    const response = await axios.post(uploadUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.secure_url;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error.message;
    } else if (error instanceof Error) {
      throw error.message;
    } else {
      throw "An unknown error occurred";
    }
  }
};

interface AddContentRequest {
  contentType: string;
  squad: string;
  title: string;
  content: string;
  isPremium: boolean;
  thumbnailUrl: string | null | undefined;
  videoUrl: string | null | undefined;
}

const ContentService = {
  // Add new content
  addContent: (requestData: AddContentRequest) =>
    handleApi(() => api.post<any>(CONTENT_ROUTES.POST, requestData)),

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
