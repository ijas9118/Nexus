import { FilterQuery, Types } from 'mongoose';
import { IBaseRepository } from './IBaseRepository';
import { ITargetAudience } from '@/models/target-audience.model';

export interface ITargetAudienceRepository extends IBaseRepository<ITargetAudience> {
  findById(id: Types.ObjectId | string): Promise<ITargetAudience | null>;
  findAll(): Promise<ITargetAudience[]>;
  create(data: Partial<ITargetAudience>): Promise<ITargetAudience>;
  update(
    id: Types.ObjectId | string,
    data: Partial<ITargetAudience>
  ): Promise<ITargetAudience | null>;
  softDelete(id: Types.ObjectId | string): Promise<ITargetAudience | null>;
  restore(id: Types.ObjectId | string): Promise<ITargetAudience | null>;
  find(filter: FilterQuery<ITargetAudience>): Promise<ITargetAudience[]>;
  findOne(filter: FilterQuery<ITargetAudience>): Promise<ITargetAudience | null>;
}
