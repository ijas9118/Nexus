import { INotificationType } from '@/models/notificationType.model';

export interface INotificationTypeService {
  createNotificationType(data: {
    name: string;
    description: string;
    icon: string;
    iconColor: string;
    roles: string[];
  }): Promise<INotificationType>;
  getNotificationTypes(): Promise<INotificationType[]>;
  updateNotificationType(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      icon: string;
      iconColor: string;
      roles: string[];
    }>
  ): Promise<INotificationType>;
  deleteNotificationType(id: string): Promise<void>;
  restoreNotificationType(id: string): Promise<void>;
}
