import api from "../api";

export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await api.post("/admin/login", { email, password });
    console.log(response);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Invalid credentials. Please try again.");
    }
    throw new Error("An error occurred. Please try again later.");
  }
};
