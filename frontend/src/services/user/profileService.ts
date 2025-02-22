import api from "../api";

export const getUserProfile = async (username: string) => {
  try {
    const response = await api.post(`/user/${username}`);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred during liking.";
    throw new Error(errorMessage);
  }
};

export const updateProfile = async (data: {
  username: string;
  bio: string;
  socials: [];
}) => {
  try {
    console.log(data);
    const response = await api.post("/user/update", data);

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred during liking.";
    throw new Error(errorMessage);
  }
};
