import { handleApi } from "@/utils/handleApi";
import api from "./api";

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
      api.get<MentorMetadataData[]>(`/mentor-metadata${query}`),
    );
  },

  // Get metadata by type
  getByType: (
    type: "experienceLevel" | "expertiseArea" | "technology",
    includeInactive = false,
  ) => {
    const query = includeInactive ? "?isActive=false" : "";
    return handleApi(() =>
      api.get<MentorMetadataData[]>(`/mentor-metadata/type/${type}${query}`),
    );
  },

  // Get one by ID
  getById: (id: string) =>
    handleApi(() => api.get<MentorMetadataData>(`/mentor-metadata/${id}`)),

  // Create new metadata
  create: (data: Partial<MentorMetadataData>) =>
    handleApi(() => api.post<MentorMetadataData>("/mentor-metadata", data)),

  // Update existing metadata
  update: (id: string, data: Partial<MentorMetadataData>) =>
    handleApi(() =>
      api.put<MentorMetadataData>(`/mentor-metadata/${id}`, data),
    ),

  // Soft delete metadata
  softDelete: (id: string) =>
    handleApi(() => api.delete(`/mentor-metadata/${id}`)),

  // Restore soft-deleted metadata
  restore: (id: string) =>
    handleApi(() => api.patch(`/mentor-metadata/${id}/restore`)),
};

export default MentorMetadataService;
