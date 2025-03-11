import { inject, injectable } from 'inversify';
import { BaseService } from '../core/abstracts/base.service';
import { IPlanRepository } from '../core/interfaces/repositories/IPlanRepository';
import { IPlanService } from '../core/interfaces/services/IPlanService';
import { IPlan } from '../models/plan.model';
import { TYPES } from '../di/types';

@injectable()
export class PlanService extends BaseService<IPlan> implements IPlanService {
  constructor(@inject(TYPES.PlanRepository) private planRepository: IPlanRepository) {
    super(planRepository);
  }

  createPlan = async (planData: Partial<IPlan>): Promise<IPlan> => {
    if ((planData.price as number) <= 0) {
      throw new Error('Price must be greater than 0');
    }
    return await this.planRepository.createPlan(planData);
  };
}
