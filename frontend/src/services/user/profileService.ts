import { AxiosError } from "axios";
import api from "../api";

export const getUserProfile = async (username: string) => {
  try {
    const response = await api.post(`/user/${username}`);
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

export const updateProfile = async (data: {
  username: string;
  bio: string;
  socials: [];
}) => {
  try {
    const response = await api.post("/user/update", data);
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

export const updatePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  try {
    const response = await api.post("/user/update/password", data);
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
