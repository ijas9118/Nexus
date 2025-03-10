import { AxiosError } from "axios";
import api from "../api";

const AdminUserService = {
  getUsers: async (params = {}) => {
    try {
      const response = await api.get("admin/user", { params });
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

  getUserById: async (userId: string) => {
    try {
      const response = await api.get(`admin/user/${userId}`);
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

  updateUser: async (userId: string, userData: any) => {
    try {
      const response = await api.put(`admin/user/${userId}`, userData);
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

  // Delete a user
  deleteUser: async (userId: string) => {
    try {
      const response = await api.delete(`admin/user/${userId}`);
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

export default AdminUserService;
