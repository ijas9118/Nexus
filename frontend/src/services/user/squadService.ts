import { AxiosError } from "axios";
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
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error);
        throw error.response?.data || error.message;
      } else if (error instanceof Error) {
        throw error.message;
      } else {
        throw "An unknown error occurred";
      }
    }
  },

  getSquadsByCategory: async (category: string) => {
    try {
      const response = await api.get(`/squad?category=${category}`);
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

  joinSquad: async (squadId: string) => {
    try {
      const response = await api.post(`/squad/${squadId}/join`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error);
        throw error.response?.data || error.message;
      } else if (error instanceof Error) {
        throw error.message;
      } else {
        throw "An unknown error occurred";
      }
    }
  },

  getUserJoinedSquads: async () => {
    try {
      const response = await api.get("/user/squads");
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error);
        throw error.response?.data || error.message;
      } else if (error instanceof Error) {
        throw error.message;
      } else {
        throw "An unknown error occurred";
      }
    }
  },
};

export default SquadService;
