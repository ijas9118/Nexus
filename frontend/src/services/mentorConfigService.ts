import { AxiosError } from "axios";
import api from "./api";

export const MentorConfigService = {
  getConfigsByCategory: async (category: string) => {
    try {
      const response = await api.get(`mentorship-config/${category}`);
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
