import { ITargetAudience } from '@/models/target-audience.model';

export interface ITargetAudienceService {
  create(data: Partial<ITargetAudience>): Promise<ITargetAudience>;
  update(id: string, data: Partial<ITargetAudience>): Promise<ITargetAudience | null>;
  find(query: Partial<ITargetAudience>): Promise<ITargetAudience[]>;
  findById(id: string): Promise<ITargetAudience | null>;
  softDelete(id: string): Promise<ITargetAudience | null>;
  restore(id: string): Promise<ITargetAudience | null>;
}
