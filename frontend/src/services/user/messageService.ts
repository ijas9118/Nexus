import api from "../api";

export const MessageService = {
  getMessages: async (chatId: string) => {
    try {
      const response = await api.get(`/message/get-all-messages/${chatId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  sendMessage: async (chatId: string, text: string) => {
    try {
      const response = await api.post("/message/new-message", { chatId, text });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
