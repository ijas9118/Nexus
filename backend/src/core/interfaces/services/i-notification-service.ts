import type { INotification } from '@/models/notification.model';

export interface INotificationService {
  getNotificationTypeIdByName: (name: string) => Promise<string>;
  createForUser: (
    notificationTypeId: string,
    recipientId: string,
    heading: string,
    message: string
  ) => Promise<INotification>;
  getUserNotifications: (userId: string, read?: boolean) => Promise<INotification[]>;
  markAsRead: (id: string) => Promise<INotification | null>;
  markAllAsRead: (userId: string) => Promise<number>;
  deleteManyByIds: (ids: string[]) => Promise<number>;
  delete: (id: string) => Promise<INotification | null>;
}
