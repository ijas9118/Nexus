import api from "../api";

const AdminSquadService = {
  getAllSquads: (
    params: {
      limit?: number;
      page?: number;
      search?: string;
    } = {},
  ) =>
    api
      .get("admin/squad", {
        params: {
          limit: params.limit || 10,
          page: params.page || 1,
          search: params.search || "",
        },
      })
      .then((res) => res.data),

  toggleStatus: (id: string) =>
    api.post(`admin/squad/${id}/toggle`).then((res) => res.data),

  createSquad: (data: {
    name: string;
    description: string;
    handle: string;
    category: string;
    logoUrl?: string;
  }) => api.post("admin/squad", data).then((res) => res.data),
};

export default AdminSquadService;
