import api from "./api";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    console.log(response.data.user);
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

export const googleAuth = async (userData: {
  name?: string;
  email?: string;
  picture?: string;
}) => {
  try {
    const { name, email, picture } = userData;
    const response = await api.post("/auth/google", {
      name,
      email,
      picture,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      "An unexpected error occurred during google login.";
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

export const verifyAccessToken = async () => {
  try {
    const response = await api.get("/auth/verify-token");
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred during verifying.";
    throw new Error(errorMessage);
  }
};

export const logout = async () => {
  try {
    await api.get("/auth/logout");
    return { success: true, message: "Logged out successfully." };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred during logout.";
    throw new Error(errorMessage);
  }
};
