import { AxiosError } from "axios";
import api from "../api";

export const ChatService = {
  getChats: async () => {
    try {
      const response = await api.get("/chat/get-all-chats");
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
  createNewChat: async (member: string) => {
    try {
      const response = await api.post("/chat/create-new-chat", { member });
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
