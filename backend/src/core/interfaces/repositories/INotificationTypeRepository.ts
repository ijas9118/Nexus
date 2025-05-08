import { BaseRepository } from '@/core/abstracts/base.repository';
import { INotificationType } from '@/models/notificationType.model';

export interface INotificationTypeRepository extends BaseRepository<INotificationType> {
  createNotificationType(data: Partial<INotificationType>): Promise<INotificationType>;
  findById(id: string): Promise<INotificationType | null>;
  findByName(name: string): Promise<INotificationType | null>;
  findByRoles(roles: string[]): Promise<INotificationType[]>;
}
