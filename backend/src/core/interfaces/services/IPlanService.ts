import { IPlan } from '../../../models/plan.model';
import { BaseService } from '../../abstracts/base.service';

export interface IPlanService extends BaseService<IPlan> {
  createPlan(planData: Partial<IPlan>): Promise<IPlan>;
}
