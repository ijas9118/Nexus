import api from "../api";
import { handleApi } from "@/utils/handleApi";
import { USER_ROUTES } from "@/utils/constants";

const ProfileService = {
  getUserProfile: (username: string) =>
    handleApi(() => api.get<any>(`${USER_ROUTES.BASE}/${username}`)),

  updateProfile: (data: { username: string; bio: string; socials: [] }) =>
    handleApi(() => api.post(USER_ROUTES.UPDATE, data)),

  updatePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => handleApi(() => api.post(USER_ROUTES.UPDATE_PASSWORD, data)),

  getUserContents: (username: string) =>
    handleApi(() => api.post<any>(USER_ROUTES.CONTENTS, { username })),

  validateUsername: (username: string) =>
    handleApi(() =>
      api.get<{ status: boolean }>(`${USER_ROUTES.CHECK_USERNAME}/${username}`),
    ),
};

export default ProfileService;
