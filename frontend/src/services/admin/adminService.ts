import { AxiosError } from "axios";
import api from "../api";

export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await api.post("/admin/login", { email, password });
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
};
