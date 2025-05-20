import { handleApi } from "@/utils/handleApi";
import api from "../api";
import { Squad, SquadContent, SquadDetail } from "@/types/squad";

const SquadService = {
  createSquad: async (formData: FormData) =>
    handleApi(() =>
      api.post<any>("/squad", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    ),

  getSquadsByCategory: async (category: string) =>
    handleApi(() => api.get<Squad[]>(`/squad?category=${category}`)),

  joinSquad: async (squadId: string) =>
    handleApi(() => api.post(`/squad/${squadId}/join`)),

  getUserJoinedSquads: async () =>
    handleApi(() => api.get<any>("/user/squads")),

  getSquadDetailsByHandle: async (handle: string) =>
    handleApi(() => api.get<SquadDetail>(`/squad/detail/${handle}`)),

  getSquadContents: async (squadId: string) =>
    handleApi(() => api.get<SquadContent[]>(`/squad/${squadId}/contents`)),
};

export default SquadService;
