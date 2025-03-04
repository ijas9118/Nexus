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
};
