import api from "../api";

export const CommentService = {
  getAllComment: async () => {
    try {
      const response = await api.get("admin/comment");
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
