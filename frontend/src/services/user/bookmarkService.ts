import { AxiosError } from "axios";
import api from "../api";
import { CONTENT_ROUTES } from "@/utils/constants";

export const bookmarkContent = async (contentId: string) => {
  try {
    const result = await api.post(
      `${CONTENT_ROUTES.POST}/${contentId}/bookmark`,
    );
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
    const response = await api.get(CONTENT_ROUTES.BOOKMARKS);
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
