import { AxiosError } from "axios";
import api from "../api";
import { AUTH_ROUTES, HOST } from "@/utils/constants";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post(AUTH_ROUTES.LOGIN, { email, password });
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

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    const response = await api.post(AUTH_ROUTES.REGISTER, {
      name,
      email,
      password,
    });
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

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await api.post(AUTH_ROUTES.VERIFY_OTP, {
      email,
      otp,
    });
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

export const resendOtp = async (email: string) => {
  try {
    const response = await api.post(AUTH_ROUTES.RESEND_OTP, { email });
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

export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post(AUTH_ROUTES.FORGOT_PASSWORD, { email });
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

export const resetPassword = async (
  email: string,
  token: string,
  password: string,
) => {
  try {
    const response = await api.post(AUTH_ROUTES.RESET_PASSWORD, {
      email,
      token,
      password,
    });
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

export const googleAuth = async () => {
  window.location.href = `${HOST}/api${AUTH_ROUTES.GOOGLE}`;
};

export const githubAuth = async () => {
  window.location.href = `${HOST}/api${AUTH_ROUTES.GITHUB}`;
};

export const logout = async () => {
  try {
    await api.get(AUTH_ROUTES.LOGOUT);
    return { success: true, message: "Logged out successfully." };
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
