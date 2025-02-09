import api from "../api";

const SquadService = {
  getAllSquads: async () => {
    try {
      const response = await api.get("admin/squad");
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  toggleStatus: async (id: string) => {
    try {
      const response = await api.post(`admin/squad/${id}/toggle`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  createSquad: async (data: {
    name: string;
    description: string;
    handle: string;
    category: string;
    logoUrl?: string;
  }) => {
    try {
      const response = await api.post("admin/squad", data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};

export default SquadService;
