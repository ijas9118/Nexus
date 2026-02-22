import { handleApi } from "@/utils/handleApi";
import api from "./api";
import { NotificationTypeData } from "@/types/notification";
import { NOTIFICATION_TYPE_ROUTES } from "@/utils/constants";

const NotificationTypeService = {
  // Get all notification types
  getAllTypes: () =>
    handleApi(() =>
      api.get<NotificationTypeData[]>(NOTIFICATION_TYPE_ROUTES.BASE),
    ),

  // Get one by ID
  getById: (id: string) =>
    handleApi(() =>
      api.get<NotificationTypeData>(`${NOTIFICATION_TYPE_ROUTES.BASE}/${id}`),
    ),

  // Create new notification type
  create: (data: Partial<NotificationTypeData>) =>
    handleApi(() =>
      api.post<NotificationTypeData>(NOTIFICATION_TYPE_ROUTES.BASE, data),
    ),

  // Update existing notification type
  update: (id: string, data: Partial<NotificationTypeData>) =>
    handleApi(() =>
      api.put<NotificationTypeData>(
        `${NOTIFICATION_TYPE_ROUTES.BASE}/${id}`,
        data,
      ),
    ),

  softDelete: (id: string) =>
    handleApi(() =>
      api.delete<NotificationTypeData>(
        `${NOTIFICATION_TYPE_ROUTES.BASE}/${id}`,
      ),
    ),

  // Restore
  restore: (id: string) =>
    handleApi(() =>
      api.patch<NotificationTypeData>(
        `${NOTIFICATION_TYPE_ROUTES.BASE}/${id}/restore`,
      ),
    ),
};

export default NotificationTypeService;
