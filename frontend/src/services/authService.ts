import api from "./api";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred during login.";
    throw new Error(errorMessage);
  }
};

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred during login.";
    throw new Error(errorMessage);
  }
};

export const likeContent = async (contentId: string) => {
  try {
    const response = await api.post(`/content/${contentId}/like`);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred during liking.";
    throw new Error(errorMessage);
  }
};
