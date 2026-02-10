import { injectable } from "inversify";

import type { INotificationTypeRepository } from "@/core/interfaces/repositories/i-notification-type-repository";
import type { INotificationType } from "@/models/communication/notification-type.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { NotificationTypeModel } from "@/models/communication/notification-type.model";

@injectable()
export class NotificationTypeRepository
  extends BaseRepository<INotificationType>
  implements INotificationTypeRepository {
  constructor() {
    super(NotificationTypeModel);
  }

  async createNotificationType(data: Partial<INotificationType>): Promise<INotificationType> {
    return this.create(data);
  }

  async findByName(name: string): Promise<INotificationType | null> {
    return this.model.findOne({ name }).exec();
  }

  async findByRoles(roles: string[]): Promise<INotificationType[]> {
    return this.model.find({ roles: { $in: roles } }).exec();
  }
}
