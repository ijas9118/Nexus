import { BaseService } from '@/core/abstracts/base.service';
import { IPlan } from '@/models/plan.model';

export interface IPlanService extends BaseService<IPlan> {
  createPlan(data: Partial<IPlan>): Promise<IPlan>;
  getAllPlans(): Promise<IPlan[]>;
  getPlanById(id: string): Promise<IPlan | null>;
  updatePlan(id: string, data: Partial<IPlan>): Promise<IPlan | null>;
  softDeletePlan(id: string): Promise<IPlan | null>;
}
