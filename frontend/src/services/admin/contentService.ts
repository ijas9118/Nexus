import { AxiosError } from "axios";
import api from "../api";

export const ContentService = {
  getAllContents: async () => {
    try {
      const response = await api.get("admin/content");
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
  },

  getContentById: async (contentId: string) => {
    try {
      const response = await api.get(`/content/posts/${contentId}`);
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
  },
  verifyContent: async (contentId: string) => {
    try {
      const response = await api.post(`/content/posts/verify/${contentId}`);

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
  },
};
