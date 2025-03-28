import { IPlan } from '../../../models/plan.model';
import { BaseRepository } from '../../abstracts/base.repository';

export interface IPlanRepository extends BaseRepository<IPlan> {
  createPlan(planData: Partial<IPlan>): Promise<IPlan>;
}
