import { INotification } from '@/models/notification.model';
import { IBaseRepository } from './IBaseRepository';

export interface INotificationRepository extends IBaseRepository<INotification> {
  findByUserId(userId: string, read?: boolean): Promise<INotification[]>;
  markAsRead(id: string): Promise<INotification | null>;
  markAllAsRead(userId: string): Promise<number>;
  deleteManyByIds(ids: string[]): Promise<number>;
}
