import type { Types } from 'mongoose';

import type { ITargetAudience } from '@/models/target-audience.model';

import type { IBaseRepository } from './i-base-repository';

export interface ITargetAudienceRepository extends IBaseRepository<ITargetAudience> {
  findById: (id: Types.ObjectId | string) => Promise<ITargetAudience | null>;
  findAll: () => Promise<ITargetAudience[]>;
  create: (data: Partial<ITargetAudience>) => Promise<ITargetAudience>;
  update: (
    id: Types.ObjectId | string,
    data: Partial<ITargetAudience>
  ) => Promise<ITargetAudience | null>;
  softDelete: (id: Types.ObjectId | string) => Promise<ITargetAudience | null>;
  restore: (id: Types.ObjectId | string) => Promise<ITargetAudience | null>;
}
