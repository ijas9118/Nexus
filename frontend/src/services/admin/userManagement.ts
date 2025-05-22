import { handleApi } from "@/utils/handleApi";
import api from "../api";
import { IGetUsersResponse } from "@/types/admin/user";

const AdminUserService = {
  getUsers: (page: number = 1, limit: number = 10) =>
    handleApi(() =>
      api.get<IGetUsersResponse>("admin/user", { params: { page, limit } }),
    ),

  getUserById: (userId: string) =>
    handleApi(() => api.get(`admin/user/${userId}`)),

  blockUser: (userId: string) =>
    handleApi(() => api.patch(`admin/user/block/${userId}`)),

  unblockUser: (userId: string) =>
    handleApi(() => api.patch(`admin/user/unblock/${userId}`)),
};

export default AdminUserService;
