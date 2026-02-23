import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { INotificationRepository } from "@/core/interfaces/repositories/i-notification-repository";
import type { INotificationTypeRepository } from "@/core/interfaces/repositories/i-notification-type-repository";
import type { INotificationService } from "@/core/interfaces/services/i-notification-service";
import type { INotification } from "@/models/communication/notification.model";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { NOTIFICATION_MESSAGES } = MESSAGES;

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.NotificationRepository)
    protected _repository: INotificationRepository,
    @inject(TYPES.NotificationTypeRepository)
    protected _notificationTypeRepo: INotificationTypeRepository,
  ) {}

  async getNotificationTypeIdByName(name: string): Promise<string> {
    const notificationType = await this._notificationTypeRepo.findByName(name);
    if (!notificationType || !notificationType.isActive) {
      throw new CustomError(NOTIFICATION_MESSAGES.TYPE_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    return notificationType._id.toString();
  }

  async createForUser(
    notificationTypeId: string,
    recipientId: string,
    heading: string,
    message: string,
  ): Promise<INotification> {
    const notificationType = await this._notificationTypeRepo.findById(notificationTypeId);

    if (!notificationType || !notificationType.isActive) {
      throw new CustomError(NOTIFICATION_MESSAGES.INVALID_TYPE, StatusCodes.BAD_REQUEST);
    }

    const notificationData: Partial<INotification> = {
      notificationTypeId,
      recipientId,
      heading,
      message,
      read: false,
    };

    const notification = await this._repository.create(notificationData);

    // TODO: Emit Socket.IO event for real-time notification
    // io.to(recipientId.toString()).emit('newNotification', notification);

    return notification;
  }

  async getUserNotifications(userId: string, read?: boolean): Promise<INotification[]> {
    return this._repository.findByUserId(userId, read);
  }

  async markAsRead(id: string): Promise<INotification | null> {
    return this._repository.markAsRead(id);
  }

  async markAllAsRead(userId: string): Promise<number> {
    return this._repository.markAllAsRead(userId);
  }

  async deleteManyByIds(ids: string[]): Promise<number> {
    return this._repository.deleteManyByIds(ids);
  }

  async delete(id: string): Promise<INotification | null> {
    return this._repository.delete(id);
  }
}
