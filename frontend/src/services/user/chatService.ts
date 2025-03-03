import api from "../api";

export const ChatService = {
  getChats: async () => {
    try {
      const response = await api.get("/chat/get-all-chats");
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  createNewChat: async (member: string) => {
    try {
      const response = await api.post("/chat/create-new-chat", { member });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
