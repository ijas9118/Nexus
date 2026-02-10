import { injectable } from "inversify";

import type { INotificationRepository } from "@/core/interfaces/repositories/i-notification-repository";
import type { INotification } from "@/models/notification.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { NotificationModel } from "@/models/notification.model";

@injectable()
export class NotificationRepository
  extends BaseRepository<INotification>
  implements INotificationRepository {
  constructor() {
    super(NotificationModel);
  }

  async findByUserId(userId: string, read?: boolean): Promise<INotification[]> {
    const notification = await this.model
      .find({ recipientId: userId, read: !!read })
      .populate("notificationTypeId", "name icon iconColor")
      .sort({ createdAt: -1 })
      .exec();

    return notification;
  }

  async markAsRead(id: string): Promise<INotification | null> {
    return this.model
      .findByIdAndUpdate(id, { read: true }, { new: true })
      .populate("notificationTypeId", "name icon iconColor")
      .exec();
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await this.model
      .updateMany({ recipientId: userId, read: false }, { read: true })
      .exec();
    return result.modifiedCount;
  }

  async deleteManyByIds(ids: string[]): Promise<number> {
    const result = await this.model.deleteMany({ _id: { $in: ids } }).exec();
    return result.deletedCount;
  }
}
