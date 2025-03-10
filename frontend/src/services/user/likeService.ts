import { AxiosError } from "axios";
import api from "../api";

export const likeContent = async (contentId: string) => {
  try {
    const response = await api.post(`/content/posts/${contentId}/like`);
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
};
