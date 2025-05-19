import { handleApi } from "@/utils/handleApi";
import api from "../api";
import { Squad, SquadDetail } from "@/types/squad";

const SquadService = {
  createSquad: async (formData: FormData) =>
    handleApi(() =>
      api.post("/squad", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    ),

  getSquadsByCategory: async (category: string) =>
    handleApi(() => api.get<Squad[]>(`/squad?category=${category}`)),

  joinSquad: async (squadId: string) =>
    handleApi(() => api.post(`/squad/${squadId}/join`)),

  getUserJoinedSquads: async () => handleApi(() => api.get("/user/squads")),

  getSquadDetailsByHandle: async (handle: string) =>
    handleApi(() => api.get<SquadDetail>(`/squad/detail/${handle}`)),
};

export default SquadService;
