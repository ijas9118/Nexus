import api from "../api";

export const ContentService = {
  getAllContents: async () => {
    try {
      const response = await api.get("admin/content");
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  getContentById: async (contentId: string) => {
    try {
      const response = await api.get(`/content/posts/${contentId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  verifyContent: async (contentId: string) => {
    try {
      const response = await api.post(`/content/posts/verify/${contentId}`);

      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
