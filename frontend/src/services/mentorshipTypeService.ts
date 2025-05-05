import { handleApi } from "@/utils/handleApi";
import api from "./api";
import { MentorshipTypeData } from "@/types/mentor";

const MentorshipTypeService = {
  // Get all types
  getAllTypes: (includeInactive = false) => {
    const query = includeInactive ? "?all=true" : "";
    return handleApi(() =>
      api.get<MentorshipTypeData[]>(`/mentorship-type${query}`),
    );
  },

  // Get one by ID
  getById: (id: string) =>
    handleApi(() => api.get<MentorshipTypeData>(`/mentorship-type/${id}`)),

  // Create new
  create: (data: Partial<MentorshipTypeData>) =>
    handleApi(() => api.post<MentorshipTypeData>("/mentorship-type", data)),

  // Update existing
  update: (id: string, data: Partial<MentorshipTypeData>) =>
    handleApi(() =>
      api.put<MentorshipTypeData>(`/mentorship-type/${id}`, data),
    ),

  // Soft delete
  softDelete: (id: string) =>
    handleApi(() => api.delete(`/mentorship-type/${id}`)),

  // Restore
  restore: (id: string) =>
    handleApi(() => api.patch(`/mentorship-type/${id}/restore`)),
};

export default MentorshipTypeService;
