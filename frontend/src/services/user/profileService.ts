import type { Content } from "@/types/content";
import type { UserInterface } from "@/types/user";
import { USER_ROUTES } from "@/utils/constants";
import { handleApi } from "@/utils/handleApi";

import api from "../api";

const ProfileService = {
  getUserProfile: (username: string) =>
    handleApi(() => api.get<UserInterface>(`${USER_ROUTES.BASE}/${username}`)),

  updateProfile: (data: Partial<UserInterface>) =>
    handleApi(() => api.post(USER_ROUTES.UPDATE, data)),

  updatePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => handleApi(() => api.post(USER_ROUTES.UPDATE_PASSWORD, data)),

  getUserContents: (username: string) =>
    handleApi(() => api.post<Content[]>(USER_ROUTES.CONTENTS, { username })),

  validateUsername: (username: string) =>
    handleApi(() =>
      api.get<{ status: boolean }>(`${USER_ROUTES.CHECK_USERNAME}/${username}`),
    ),
};

export default ProfileService;
