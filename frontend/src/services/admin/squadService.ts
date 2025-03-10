import { AxiosError } from "axios";
import api from "../api";

const AdminSquadService = {
  getAllSquads: async () => {
    try {
      const response = await api.get("admin/squad");
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
      const response = await api.post(`admin/squad/${id}/toggle`);
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

export default AdminSquadService;
