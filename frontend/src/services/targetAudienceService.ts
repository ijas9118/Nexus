import { handleApi } from "@/utils/handleApi";
import api from "./api";
import { TargetAudience } from "@/types/mentor";

const TargetAudienceService = {
  // Get all target audiences
  getAll: (includeInactive = false) => {
    const query = includeInactive ? "?all=true" : "";
    return handleApi(() =>
      api.get<TargetAudience[]>(`/target-audiences${query}`),
    );
  },

  // Get one by ID
  getById: (id: string) =>
    handleApi(() => api.get<TargetAudience>(`/target-audiences/${id}`)),

  // Create new target audience
  create: (data: Partial<TargetAudience>) =>
    handleApi(() => api.post<TargetAudience>("/target-audiences", data)),

  // Update existing target audience
  update: (id: string, data: Partial<TargetAudience>) =>
    handleApi(() => api.put<TargetAudience>(`/target-audiences/${id}`, data)),

  // Soft delete target audience
  softDelete: (id: string) =>
    handleApi(() => api.delete(`/target-audiences/${id}`)),

  // Restore soft-deleted target audience
  restore: (id: string) =>
    handleApi(() => api.patch(`/target-audiences/${id}/restore`)),
};

export default TargetAudienceService;
