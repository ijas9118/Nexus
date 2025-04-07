import { AxiosError } from "axios";
import api from "../api";

export const ChatService = {
  fetchChats: async () => {
    try {
      const response = await api.get("/chat/chats");
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
      const response = await api.get("/chat/groups");
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
      const response = await api.get("/chat/messages", {
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
