import { handleApi } from "@/utils/handleApi";
import api from "./api";
import { MENTOR_METADATA_ROUTES } from "@/utils/constants";

export interface MentorMetadataData {
  _id: string;
  label: string;
  name: string;
  type: "experienceLevel" | "expertiseArea" | "technology";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const MentorMetadataService = {
  // Get all metadata entries
  getAll: (includeInactive = false) => {
    const query = includeInactive ? "?all=true" : "";
    return handleApi(() =>
      api.get<MentorMetadataData[]>(`${MENTOR_METADATA_ROUTES.BASE}${query}`),
    );
  },

  // Get metadata by type
  getByType: (
    type: "experienceLevel" | "expertiseArea" | "technology",
    includeInactive = false,
  ) => {
    const query = includeInactive ? "?isActive=false" : "";
    return handleApi(() =>
      api.get<MentorMetadataData[]>(
        `${MENTOR_METADATA_ROUTES.TYPE}/${type}${query}`,
      ),
    );
  },

  // Get one by ID
  getById: (id: string) =>
    handleApi(() =>
      api.get<MentorMetadataData>(`${MENTOR_METADATA_ROUTES.BASE}/${id}`),
    ),

  // Create new metadata
  create: (data: Partial<MentorMetadataData>) =>
    handleApi(() =>
      api.post<MentorMetadataData>(MENTOR_METADATA_ROUTES.BASE, data),
    ),

  // Update existing metadata
  update: (id: string, data: Partial<MentorMetadataData>) =>
    handleApi(() =>
      api.put<MentorMetadataData>(`${MENTOR_METADATA_ROUTES.BASE}/${id}`, data),
    ),

  // Soft delete metadata
  softDelete: (id: string) =>
    handleApi(() => api.delete(`${MENTOR_METADATA_ROUTES.BASE}/${id}`)),

  // Restore soft-deleted metadata
  restore: (id: string) =>
    handleApi(() => api.patch(`${MENTOR_METADATA_ROUTES.BASE}/${id}/restore`)),
};

export default MentorMetadataService;
