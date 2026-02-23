import { handleApi } from "@/utils/handleApi";
import api from "../api";
import { SquadContent, SquadDetail } from "@/types/squad";
import { SQUAD_ROUTES, USER_ROUTES } from "@/utils/constants";

const SquadService = {
  createSquad: async (formData: FormData) =>
    handleApi(() =>
      api.post<any>(SQUAD_ROUTES.BASE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    ),

  getSquadsByCategory: async (category: string) =>
    handleApi(() =>
      api.get<SquadDetail[]>(`${SQUAD_ROUTES.BASE}?category=${category}`),
    ),

  joinSquad: async (squadId: string) =>
    handleApi(() => api.post<void>(`${SQUAD_ROUTES.BASE}/${squadId}/join`)),

  leaveSquad: async (squadId: string) =>
    handleApi(() => api.post(`${SQUAD_ROUTES.BASE}/${squadId}/leave`)),

  getUserJoinedSquads: async () =>
    handleApi(() => api.get<any>(USER_ROUTES.SQUADS)),

  getSquadDetailsByHandle: async (handle: string) =>
    handleApi(() => api.get<SquadDetail>(`${SQUAD_ROUTES.DETAIL}/${handle}`)),

  getSquadContents: async (squadId: string) =>
    handleApi(() =>
      api.get<SquadContent[]>(`${SQUAD_ROUTES.BASE}/${squadId}/contents`),
    ),

  getJoinedSquads: async (userId: string) =>
    handleApi(() => api.post<any[]>(SQUAD_ROUTES.JOINED, { userId })),
};

export default SquadService;
