import { handleApi } from "@/utils/handleApi";
import api from "./api";
import { INotification } from "@/types/notification";
import { NOTIFICATION_ROUTES } from "@/utils/constants";

const NotificationService = {
  getUserNotifications: (userId: string, read?: boolean) =>
    handleApi(() =>
      api.get<INotification[]>(`${NOTIFICATION_ROUTES.BASE}/${userId}`, {
        params: { read },
      }),
    ),

  markAsRead: (id: string) =>
    handleApi(() => api.patch(`${NOTIFICATION_ROUTES.BASE}/${id}/read`)),

  markAllAsRead: (userId: string) =>
    handleApi(() => api.patch(`${NOTIFICATION_ROUTES.READ_ALL}/${userId}`)),

  delete: (id: string) =>
    handleApi(() => api.delete(`${NOTIFICATION_ROUTES.BASE}/${id}`)),

  deleteMany: (ids: string[]) =>
    handleApi(() => api.delete(NOTIFICATION_ROUTES.BASE, { data: { ids } })),
};

export default NotificationService;
