import { handleApi } from "@/utils/handleApi";
import api from "../api";
import { IGetUsersResponse } from "@/types/admin/user";
import { ADMIN_ROUTES } from "@/utils/constants";

const AdminUserService = {
  getUsers: (page: number = 1, limit: number = 10) =>
    handleApi(() =>
      api.get<IGetUsersResponse>(ADMIN_ROUTES.USER, {
        params: { page, limit },
      }),
    ),

  getUserById: (userId: string) =>
    handleApi(() => api.get(`${ADMIN_ROUTES.USER}/${userId}`)),

  blockUser: (userId: string) =>
    handleApi(() => api.patch(`${ADMIN_ROUTES.USER}/block/${userId}`)),

  unblockUser: (userId: string) =>
    handleApi(() => api.patch(`${ADMIN_ROUTES.USER}/unblock/${userId}`)),
};

export default AdminUserService;
