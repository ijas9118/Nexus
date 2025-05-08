import { BaseService } from '@/core/abstracts/base.service';
import { INotificationRepository } from '@/core/interfaces/repositories/INotificationRepository';
import { INotificationTypeRepository } from '@/core/interfaces/repositories/INotificationTypeRepository';
import { INotificationService } from '@/core/interfaces/services/INotificationService';
import { TYPES } from '@/di/types';
import { INotification } from '@/models/notification.model';
import CustomError from '@/utils/CustomError';
import { injectable, inject } from 'inversify';

@injectable()
export class NotificationService
  extends BaseService<INotification>
  implements INotificationService
{
  constructor(
    @inject(TYPES.NotificationRepository)
    protected repository: INotificationRepository,
    @inject(TYPES.NotificationTypeRepository)
    protected notificationTypeRepo: INotificationTypeRepository
  ) {
    super(repository);
  }

  async getNotificationTypeIdByName(name: string): Promise<string> {
    const notificationType = await this.notificationTypeRepo.findByName(name);
    if (!notificationType || !notificationType.isActive) {
      throw new CustomError(`Notification type "${name}" not found or is inactive`);
    }
    return notificationType._id.toString();
  }

  async createForUser(
    notificationTypeId: string,
    recipientId: string,
    heading: string,
    message: string
  ): Promise<INotification> {
    const notificationType = await this.notificationTypeRepo.findById(notificationTypeId);

    if (!notificationType || !notificationType.isActive) {
      throw new CustomError('Invalid or inactive notification type');
    }

    const notificationData: Partial<INotification> = {
      notificationTypeId,
      recipientId,
      heading,
      message,
      read: false,
    };

    const notification = await this.repository.create(notificationData);

    // TODO: Emit Socket.IO event for real-time notification
    // io.to(recipientId.toString()).emit('newNotification', notification);

    return notification;
  }

  async getUserNotifications(userId: string, read?: boolean): Promise<INotification[]> {
    console.log(userId);
    return this.repository.findByUserId(userId, read);
  }

  async markAsRead(id: string): Promise<INotification | null> {
    return this.repository.markAsRead(id);
  }

  async markAllAsRead(userId: string): Promise<number> {
    return this.repository.markAllAsRead(userId);
  }

  async deleteManyByIds(ids: string[]): Promise<number> {
    return this.repository.deleteManyByIds(ids);
  }
}
