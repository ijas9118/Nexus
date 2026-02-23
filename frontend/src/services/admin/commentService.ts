import { AxiosError } from "axios";
import api from "../api";
import { ADMIN_ROUTES } from "@/utils/constants";

export const CommentService = {
  getAllComment: async () => {
    try {
      const response = await api.get(ADMIN_ROUTES.COMMENT);
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
