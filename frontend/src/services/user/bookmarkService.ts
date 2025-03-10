import { AxiosError } from "axios";
import api from "../api";

export const bookmarkContent = async (contentId: string) => {
  try {
    const result = await api.post(`/content/posts/${contentId}/bookmark`);
    return result.data;
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

export const getAllBookmarks = async () => {
  try {
    const response = await api.get("/content/posts/bookmarks");
    return response.data;
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
