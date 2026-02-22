import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { INotificationTypeRepository } from "@/core/interfaces/repositories/i-notification-type-repository";
import type { INotificationTypeService } from "@/core/interfaces/services/i-notification-type-service";
import type { INotificationType } from "@/models/communication/notification-type.model";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { NOTIFICATION_MESSAGES } = MESSAGES;

@injectable()
export class NotificationTypeService implements INotificationTypeService {
  constructor(
    @inject(TYPES.NotificationTypeRepository)
    private _notificationTypeRepository: INotificationTypeRepository,
  ) {}

  async createNotificationType(data: {
    name: string;
    description: string;
    icon: string;
    iconColor: string;
    roles: string[];
  }): Promise<INotificationType> {
    const existingType = await this._notificationTypeRepository.findByName(data.name);
    if (existingType) {
      throw new CustomError(NOTIFICATION_MESSAGES.TYPE_EXISTS, StatusCodes.CONFLICT);
    }

    const notificationType = await this._notificationTypeRepository.createNotificationType(data);

    return notificationType;
  }

  async getNotificationTypes(): Promise<INotificationType[]> {
    return this._notificationTypeRepository.findAll();
  }

  async updateNotificationType(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      icon: string;
      iconColor: string;
      roles: string[];
    }>,
  ): Promise<INotificationType> {
    if (data.name) {
      const existingType = await this._notificationTypeRepository.findByName(data.name);
      if (existingType && existingType._id.toString() !== id) {
        throw new CustomError(NOTIFICATION_MESSAGES.TYPE_EXISTS, StatusCodes.CONFLICT);
      }
    }

    const updatedType = await this._notificationTypeRepository.update(id, data);
    if (!updatedType) {
      throw new CustomError(NOTIFICATION_MESSAGES.NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    return updatedType;
  }

  async deleteNotificationType(id: string): Promise<void> {
    await this._notificationTypeRepository.softDelete(id);
  }

  async restoreNotificationType(id: string): Promise<void> {
    await this._notificationTypeRepository.restore(id);
  }
}
