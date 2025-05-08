import { BaseRepository } from '@/core/abstracts/base.repository';
import { INotificationTypeRepository } from '@/core/interfaces/repositories/INotificationTypeRepository';
import { INotificationType, NotificationTypeModel } from '@/models/notificationType.model';
import { injectable } from 'inversify';

@injectable()
export class NotificationTypeRepository
  extends BaseRepository<INotificationType>
  implements INotificationTypeRepository
{
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
