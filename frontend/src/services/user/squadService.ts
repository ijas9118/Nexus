import api from "../api";

const SquadService = {

  createSquad: async (data: {
    name: string;
    description: string;
    handle: string;
    category: string;
    logoUrl?: string;
  }) => {
    try {
      const response = await api.post("/squad", data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  getSquadsByCategory: async (category: string) => {
    try {
      const response = await api.get(`/squad?category=${category}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};

export default SquadService;
