import api from "../api";

const CategoryService = {
  getAllCategory: async () => {
    try {
      const response = await api.get("admin/category");
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  toggleStatus: async (id: string) => {
    try {
      const response = await api.post(`admin/category/${id}/toggle`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};

export default CategoryService;
