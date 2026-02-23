import { handleApi } from "@/utils/handleApi";
import api from "./api";
import { TargetAudience } from "@/types/mentor";
import { TARGET_AUDIENCE_ROUTES } from "@/utils/constants";

const TargetAudienceService = {
  // Get all target audiences
  getAll: (includeInactive = false) => {
    const query = includeInactive ? "?all=true" : "";
    return handleApi(() =>
      api.get<TargetAudience[]>(`${TARGET_AUDIENCE_ROUTES.BASE}${query}`),
    );
  },

  // Get one by ID
  getById: (id: string) =>
    handleApi(() =>
      api.get<TargetAudience>(`${TARGET_AUDIENCE_ROUTES.BASE}/${id}`),
    ),

  // Create new target audience
  create: (data: Partial<TargetAudience>) =>
    handleApi(() =>
      api.post<TargetAudience>(TARGET_AUDIENCE_ROUTES.BASE, data),
    ),

  // Update existing target audience
  update: (id: string, data: Partial<TargetAudience>) =>
    handleApi(() =>
      api.put<TargetAudience>(`${TARGET_AUDIENCE_ROUTES.BASE}/${id}`, data),
    ),

  // Soft delete target audience
  softDelete: (id: string) =>
    handleApi(() => api.delete(`${TARGET_AUDIENCE_ROUTES.BASE}/${id}`)),

  // Restore soft-deleted target audience
  restore: (id: string) =>
    handleApi(() => api.patch(`${TARGET_AUDIENCE_ROUTES.BASE}/${id}/restore`)),
};

export default TargetAudienceService;
