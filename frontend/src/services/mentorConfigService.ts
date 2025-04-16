import api from "./api";
import { MentorshipConfig } from "@/types/mentor";
import { handleApi } from "@/utils/handleApi";

export const MentorConfigService = {
  getConfigsByCategory: (category: string) =>
    handleApi(() =>
      api.get<MentorshipConfig[]>(`mentorship-config/${category}`),
    ),

  getAllConfigs: () =>
    handleApi(() => api.get<MentorshipConfig[]>("mentorship-config")),

  getConfigById: (id: string) =>
    handleApi(() => api.get<MentorshipConfig>(`mentorship-config/id/${id}`)),

  createConfig: (config: MentorshipConfig) =>
    handleApi(() => api.post<MentorshipConfig>("mentorship-config", config)),

  updateConfig: (id: string, config: Partial<MentorshipConfig>) =>
    handleApi(() =>
      api.put<MentorshipConfig>(`mentorship-config/${id}`, config),
    ),

  deleteConfig: (id: string) =>
    handleApi(() => api.delete<void>(`mentorship-config/${id}`)),
};
