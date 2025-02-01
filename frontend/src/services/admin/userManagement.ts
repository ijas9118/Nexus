import api from "../api";

const AdminUserService = {
  getUsers: async (params = {}) => {
    try {
      const response = await api.get("admin/user", { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  getUserById: async (userId: string) => {
    try {
      const response = await api.get(`admin/user/${userId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  updateUser: async (userId: string, userData: any) => {
    try {
      const response = await api.put(`admin/user/${userId}`, userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a user
  deleteUser: async (userId: string) => {
    try {
      const response = await api.delete(`admin/user/${userId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};

export default AdminUserService;
