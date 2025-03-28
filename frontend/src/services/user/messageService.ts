import { AxiosError } from "axios";
import api from "../api";
import { MESSAGE_ROUTES } from "@/utils/constants";

export const MessageService = {
  getMessages: async (connection: string) => {
    try {
      const response = await api.post(MESSAGE_ROUTES.GET_MESSAGES, {
        id: connection,
      });
      return response.data.data;
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

  getUsersWithChat: async () => {
    try {
      const response = await api.get(MESSAGE_ROUTES.GET_USERS_WITH_CHAT);
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

  uploadFile: async (formData: FormData) => {
    try {
      const response = await api.post(MESSAGE_ROUTES.UPLOAD_FILE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response;
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
