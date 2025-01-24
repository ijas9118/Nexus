import api from "./api";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    console.log(response.data.user);
    localStorage.setItem("accessToken", response.data.user.accessToken);
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
    localStorage.setItem("accessToken", response.data.user.accessToken);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred during login.";
    throw new Error(errorMessage);
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await api.post("/auth/verify-otp", {
      email,
      otp,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "An unexpected error occurred during verifying otp.";
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
