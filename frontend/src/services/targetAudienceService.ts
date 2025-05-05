import { handleApi } from "@/utils/handleApi";
import api from "./api";

export interface TargetAudienceData {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const TargetAudienceService = {
  // Get all target audiences
  getAll: (includeInactive = false) => {
    const query = includeInactive ? "?all=true" : "";
    return handleApi(() =>
      api.get<TargetAudienceData[]>(`/target-audiences${query}`),
    );
  },

  // Get one by ID
  getById: (id: string) =>
    handleApi(() => api.get<TargetAudienceData>(`/target-audiences/${id}`)),

  // Create new target audience
  create: (data: Partial<TargetAudienceData>) =>
    handleApi(() => api.post<TargetAudienceData>("/target-audiences", data)),

  // Update existing target audience
  update: (id: string, data: Partial<TargetAudienceData>) =>
    handleApi(() =>
      api.put<TargetAudienceData>(`/target-audiences/${id}`, data),
    ),

  // Soft delete target audience
  softDelete: (id: string) =>
    handleApi(() => api.delete(`/target-audiences/${id}`)),

  // Restore soft-deleted target audience
  restore: (id: string) =>
    handleApi(() => api.patch(`/target-audiences/${id}/restore`)),
};

export default TargetAudienceService;
