import { AxiosError } from "axios";
import api from "../api";

export const MessageService = {
  getMessages: async (chatId: string) => {
    try {
      const response = await api.get(`/message/get-all-messages/${chatId}`);
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
  sendMessage: async (chatId: string, text: string) => {
    try {
      const response = await api.post("/message/new-message", { chatId, text });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error);
        throw error.response?.data || error.message;
      } else if (error instanceof Error) {
        throw error.message;
      } else {
        throw "An unknown error occurred";
      }
    }
  },
};
