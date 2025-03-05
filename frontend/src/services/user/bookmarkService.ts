import api from "../api";

export const bookmarkContent = async (contentId: string) => {
  try {
    const result = await api.post(`/content/posts/${contentId}/bookmark`);
    return result.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "An unexpected error occurred while bookmarking.";
    throw new Error(errorMessage);
  }
};

export const getAllBookmarks = async () => {
  try {
    const response = await api.get("/content/posts/bookmarks");
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "An unexpected error occurred during fetching bookmarks.";
    throw new Error(errorMessage);
  }
};
