import type { INotification } from "@/models/notification.model";

import type { IBaseRepository } from "./i-base-repository";

export interface INotificationRepository extends IBaseRepository<INotification> {
  findByUserId: (userId: string, read?: boolean) => Promise<INotification[]>;
  markAsRead: (id: string) => Promise<INotification | null>;
  markAllAsRead: (userId: string) => Promise<number>;
  deleteManyByIds: (ids: string[]) => Promise<number>;
}
