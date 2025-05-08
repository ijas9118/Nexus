import { injectable } from 'inversify';
import { FilterQuery, Types } from 'mongoose';
import { INotification, NotificationModel } from '../models/notification.model';
import { BaseRepository } from '@/core/abstracts/base.repository';
import { INotificationRepository } from '@/core/interfaces/repositories/INotificationRepository';

@injectable()
export class NotificationRepository
  extends BaseRepository<INotification>
  implements INotificationRepository
{
  constructor() {
    super(NotificationModel);
  }

  async findByUserId(userId: Types.ObjectId | string, read?: boolean): Promise<INotification[]> {
    const filter: FilterQuery<INotification> = { recipientId: userId };
    if (read !== undefined) {
      filter.read = read;
    }
    const notification = await this.model
      .find({ recipientId: userId })
      .populate('notificationTypeId', 'name icon iconColor')
      .sort({ createdAt: -1 })
      .exec();

    return notification;
  }

  async markAsRead(id: Types.ObjectId | string): Promise<INotification | null> {
    return this.model
      .findByIdAndUpdate(id, { read: true }, { new: true })
      .populate('notificationTypeId', 'name icon iconColor')
      .exec();
  }

  async markAllAsRead(userId: Types.ObjectId | string): Promise<number> {
    const result = await this.model
      .updateMany({ recipientId: userId, read: false }, { read: true })
      .exec();
    return result.modifiedCount;
  }

  async deleteManyByIds(ids: (Types.ObjectId | string)[]): Promise<number> {
    const result = await this.model.deleteMany({ _id: { $in: ids } }).exec();
    return result.deletedCount;
  }
}
