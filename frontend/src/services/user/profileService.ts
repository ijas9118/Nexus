import api from "../api";
import { handleApi } from "@/utils/handleApi";

const ProfileService = {
  getUserProfile: (username: string) =>
    handleApi(() => api.get<any>(`/user/${username}`)),

  updateProfile: (data: { username: string; bio: string; socials: [] }) =>
    handleApi(() => api.post("/user/update", data)),

  updatePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => handleApi(() => api.post("/user/update/password", data)),

  getUserContents: (username: string) =>
    handleApi(() => api.post<any>("/user/contents", { username })),

  validateUsername: (username: string) =>
    handleApi(() =>
      api.get<{ status: boolean }>(`/user/check-username/${username}`),
    ),
};

export default ProfileService;
