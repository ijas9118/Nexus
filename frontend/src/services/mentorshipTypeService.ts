import { handleApi } from "@/utils/handleApi";
import api from "./api";
import { MentorshipTypeData } from "@/types/mentor";
import { MENTORSHIP_TYPE_ROUTES } from "@/utils/constants";

const MentorshipTypeService = {
  // Get all types
  getAllTypes: (includeInactive = false) => {
    const query = includeInactive ? "?all=true" : "";
    return handleApi(() =>
      api.get<MentorshipTypeData[]>(`${MENTORSHIP_TYPE_ROUTES.BASE}${query}`),
    );
  },

  // Get one by ID
  getById: (id: string) =>
    handleApi(() =>
      api.get<MentorshipTypeData>(`${MENTORSHIP_TYPE_ROUTES.BASE}/${id}`),
    ),

  // Create new
  create: (data: Partial<MentorshipTypeData>) =>
    handleApi(() =>
      api.post<MentorshipTypeData>(MENTORSHIP_TYPE_ROUTES.BASE, data),
    ),

  // Update existing
  update: (id: string, data: Partial<MentorshipTypeData>) =>
    handleApi(() =>
      api.put<MentorshipTypeData>(`${MENTORSHIP_TYPE_ROUTES.BASE}/${id}`, data),
    ),

  // Soft delete
  softDelete: (id: string) =>
    handleApi(() => api.delete(`${MENTORSHIP_TYPE_ROUTES.BASE}/${id}`)),

  // Restore
  restore: (id: string) =>
    handleApi(() => api.patch(`${MENTORSHIP_TYPE_ROUTES.BASE}/${id}/restore`)),
};

export default MentorshipTypeService;
