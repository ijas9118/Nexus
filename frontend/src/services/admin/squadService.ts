import api from "../api";
import { ADMIN_ROUTES } from "@/utils/constants";

const AdminSquadService = {
  getAllSquads: (
    params: {
      limit?: number;
      page?: number;
      search?: string;
    } = {},
  ) =>
    api
      .get(ADMIN_ROUTES.SQUAD, {
        params: {
          limit: params.limit || 10,
          page: params.page || 1,
          search: params.search || "",
        },
      })
      .then((res) => res.data),

  toggleStatus: (id: string) =>
    api.post(`${ADMIN_ROUTES.SQUAD}/${id}/toggle`).then((res) => res.data),

  createSquad: (data: {
    name: string;
    description: string;
    handle: string;
    category: string;
    logoUrl?: string;
  }) => api.post(ADMIN_ROUTES.SQUAD, data).then((res) => res.data),
};

export default AdminSquadService;
