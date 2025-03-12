import { AxiosError } from "axios";
import api from "../api";

const MentorService = {
  sendInvite: async (data: {
    email: string;
    name: string;
    specialization: string;
  }) => {
    try {
      const response = await api.post("admin/mentor/invite", data);
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

  acceptInvite: async (token: string) => {
    try {
      const response = await api.post("admin/mentor/acceptInvite", { token });
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

  completeProfile: async (data: {
    email: string;
    name: string;
    password: string;
  }) => {
    try {
      const response = await api.post("/mentor/register", data);
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

  getAllMentors: async () => {
    try {
      const response = await api.get("/mentor");
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

  createMentorApplication: async (data: any) => {
    try {
      console.log(data);
      // const response = await api.post("/mentor/register", data);
      // return response.data;
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

export default MentorService;
