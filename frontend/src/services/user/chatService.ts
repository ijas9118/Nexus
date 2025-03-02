import api from "../api";

export const ChatService = {
  getChats: async (searchTerm?: string) => {
    try {
      const response = await api.get("/chat/get-all-chats", {
        params: {
          search: searchTerm,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  createNewChat: async (user: string) => {
    try {
      const response = await api.post("/chat/create-new-chat", { user });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
