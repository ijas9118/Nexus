import { AxiosError } from "axios";
import api from "../api";

export const CommentService = {
  getAllComment: async () => {
    try {
      const response = await api.get("admin/comment");
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
