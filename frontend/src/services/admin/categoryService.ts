import { AxiosError } from "axios";
import api from "../api";

const CategoryService = {
  getAllCategory: async () => {
    try {
      const response = await api.get("admin/category");
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

  toggleStatus: async (id: string) => {
    try {
      const response = await api.post(`admin/category/${id}/toggle`);
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

export default CategoryService;
