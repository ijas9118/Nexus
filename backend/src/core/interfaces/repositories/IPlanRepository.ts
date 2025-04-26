import { BaseRepository } from '@/core/abstracts/base.repository';
import { IPlan } from '@/models/plan.model';

export interface IPlanRepository extends BaseRepository<IPlan> {
  softDelete(planId: string): Promise<IPlan | null>;
  findActivePlans(): Promise<IPlan[]>;
}
