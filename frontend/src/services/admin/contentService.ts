import { AxiosError } from "axios";
import api from "../api";
import { ADMIN_ROUTES, CONTENT_ROUTES } from "@/utils/constants";

export const ContentService = {
  getAllContents: async () => {
    try {
      const response = await api.get(ADMIN_ROUTES.CONTENT);
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
      const response = await api.get(`${CONTENT_ROUTES.POST}/${contentId}`);
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
      const response = await api.post(
        `${CONTENT_ROUTES.POST}/verify/${contentId}`,
      );

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
