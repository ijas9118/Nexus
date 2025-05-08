import { handleApi } from "@/utils/handleApi";
import api from "./api";
import { NotificationTypeData } from "@/types/notification";

const NotificationTypeService = {
  // Get all notification types
  getAllTypes: () =>
    handleApi(() => api.get<NotificationTypeData[]>("/notification-types")),

  // Get one by ID
  getById: (id: string) =>
    handleApi(() => api.get<NotificationTypeData>(`/notification-types/${id}`)),

  // Create new notification type
  create: (data: Partial<NotificationTypeData>) =>
    handleApi(() =>
      api.post<NotificationTypeData>("/notification-types", data),
    ),

  // Update existing notification type
  update: (id: string, data: Partial<NotificationTypeData>) =>
    handleApi(() =>
      api.put<NotificationTypeData>(`/notification-types/${id}`, data),
    ),

  softDelete: (id: string) =>
    handleApi(() =>
      api.delete<NotificationTypeData>(`/notification-types/${id}`),
    ),

  // Restore
  restore: (id: string) =>
    handleApi(() =>
      api.patch<NotificationTypeData>(`/notification-types/${id}/restore`),
    ),
};

export default NotificationTypeService;
