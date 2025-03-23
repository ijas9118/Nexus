import { AxiosError } from "axios";
import api from "../api";
import { CONTENT_ROUTES } from "@/utils/constants";

export const CommentService = {
  addComment: async (
    contentId: string,
    text: string,
    parentCommentId?: string,
  ) => {
    try {
      const response = await api.post(CONTENT_ROUTES.COMMENTS, {
        contentId,
        text,
        parentCommentId,
      });
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

  getCommentsByContentId: async (contentId: string) => {
    try {
      const response = await api.get(CONTENT_ROUTES.COMMENTS, {
        params: {
          contentId,
        },
      });
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
