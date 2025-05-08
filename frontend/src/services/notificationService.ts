import { handleApi } from "@/utils/handleApi";
import api from "./api";
import { INotification } from "@/types/notification";

const NotificationService = {
  getUserNotifications: (userId: string, read?: boolean) =>
    handleApi(() =>
      api.get<INotification[]>(`/notifications/${userId}`, {
        params: { read },
      }),
    ),

  markAsRead: (id: string) =>
    handleApi(() => api.patch(`/notifications/${id}/read`)),

  markAllAsRead: (userId: string) =>
    handleApi(() => api.patch(`/notifications/${userId}/read-all`)),

  delete: (id: string) => handleApi(() => api.delete(`/notifications/${id}`)),

  deleteMany: (ids: string[]) =>
    handleApi(() => api.delete(`/notifications`, { data: { ids } })),
};

export default NotificationService;
