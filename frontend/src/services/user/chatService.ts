import { AxiosError } from "axios";
import api from "../api";
import { CHAT_ROUTES } from "@/utils/constants";

export const ChatService = {
  fetchChats: async () => {
    try {
      const response = await api.get(CHAT_ROUTES.CHATS);
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
  fetchGroups: async () => {
    try {
      const response = await api.get(CHAT_ROUTES.GROUPS);
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
  fetchMessages: async (chatId: string, chatType: "Chat" | "Group") => {
    try {
      const response = await api.get(CHAT_ROUTES.MESSAGES, {
        params: { chatId, chatType },
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
