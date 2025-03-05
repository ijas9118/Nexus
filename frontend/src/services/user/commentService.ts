import api from "../api";

export const CommentService = {
  addComment: async (
    contentId: string,
    text: string,
    parentCommentId?: string,
  ) => {
    try {
      const response = await api.post("/content/comment", {
        contentId,
        text,
        parentCommentId,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  getCommentsByContentId: async (contentId: string) => {
    try {
      const response = await api.get("/content/comment", {
        params: {
          contentId,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
