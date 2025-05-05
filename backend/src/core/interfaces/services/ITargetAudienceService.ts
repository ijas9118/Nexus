import { FilterQuery, Types } from 'mongoose';
import { IBaseService } from './IBaseService';
import { ITargetAudience } from '@/models/target-audience.model';

export interface ITargetAudienceService extends IBaseService<ITargetAudience> {
  create(data: Partial<ITargetAudience>): Promise<ITargetAudience>;
  findById(id: Types.ObjectId | string): Promise<ITargetAudience | null>;
  findOne(conditions: FilterQuery<ITargetAudience>): Promise<ITargetAudience | null>;
  find(conditions: FilterQuery<ITargetAudience>): Promise<ITargetAudience[]>;
  update(
    id: Types.ObjectId | string,
    data: Partial<ITargetAudience>
  ): Promise<ITargetAudience | null>;
  softDelete(id: Types.ObjectId | string): Promise<ITargetAudience | null>;
  restore(id: Types.ObjectId | string): Promise<ITargetAudience | null>;
}
