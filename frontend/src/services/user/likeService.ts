import api from "../api";

export const likeContent = async (contentId: string) => {
  try {
    const response = await api.post(`/content/posts/${contentId}/like`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred during liking.";
    throw new Error(errorMessage);
  }
};
