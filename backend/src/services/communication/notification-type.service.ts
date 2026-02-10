import { inject, injectable } from "inversify";

import type { INotificationTypeRepository } from "@/core/interfaces/repositories/i-notification-type-repository";
import type { INotificationTypeService } from "@/core/interfaces/services/i-notification-type-service";
import type { INotificationType } from "@/models/communication/notification-type.model";

import { TYPES } from "@/di/types";

@injectable()
export class NotificationTypeService implements INotificationTypeService {
  constructor(
    @inject(TYPES.NotificationTypeRepository)
    private notificationTypeRepository: INotificationTypeRepository,
  ) {}

  async createNotificationType(data: {
    name: string;
    description: string;
    icon: string;
    iconColor: string;
    roles: string[];
  }): Promise<INotificationType> {
    const existingType = await this.notificationTypeRepository.findByName(data.name);
    if (existingType) {
      throw new Error("Notification type with this name already exists");
    }

    const notificationType = await this.notificationTypeRepository.createNotificationType(data);

    return notificationType;
  }

  async getNotificationTypes(): Promise<INotificationType[]> {
    return this.notificationTypeRepository.findAll();
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
      const existingType = await this.notificationTypeRepository.findByName(data.name);
      if (existingType && existingType._id.toString() !== id) {
        throw new Error("Notification type with this name already exists");
      }
    }

    const updatedType = await this.notificationTypeRepository.update(id, data);
    if (!updatedType) {
      throw new Error("Notification type not found");
    }

    return updatedType;
  }

  async deleteNotificationType(id: string): Promise<void> {
    await this.notificationTypeRepository.softDelete(id);
  }

  async restoreNotificationType(id: string): Promise<void> {
    await this.notificationTypeRepository.restore(id);
  }
}
