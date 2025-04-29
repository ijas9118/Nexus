import { BaseService } from '@/core/abstracts/base.service';
import { IPlanRepository } from '@/core/interfaces/repositories/IPlanRepository';
import { IPlanService } from '@/core/interfaces/services/IPlanService';
import { TYPES } from '@/di/types';
import { IPlan } from '@/models/plan.model';
import { inject, injectable } from 'inversify';

@injectable()
export class PlanService extends BaseService<IPlan> implements IPlanService {
  constructor(@inject(TYPES.PlanRepository) private planRepository: IPlanRepository) {
    super(planRepository);
  }

  createPlan = async (data: Partial<IPlan>): Promise<IPlan> => {
    const existingPlan = await this.planRepository.findOne({ tier: data.tier });
    if (existingPlan) {
      throw new Error('Plan with this tier already exists');
    }
    // Ensure interval is provided
    if (!data.interval) {
      throw new Error('Interval is required');
    }
    return this.planRepository.create(data);
  };

  getAllPlans = async (): Promise<IPlan[]> => {
    return this.planRepository.findActivePlans();
  };

  getPlanById = async (id: string): Promise<IPlan | null> => {
    return this.planRepository.findById(id);
  };

  updatePlan = async (id: string, data: Partial<IPlan>): Promise<IPlan | null> => {
    const existingPlan = await this.planRepository.findById(id);
    if (!existingPlan) {
      throw new Error('Plan not found');
    }
    return this.planRepository.update(id, { ...data, updatedAt: new Date() });
  };

  softDeletePlan = async (id: string): Promise<IPlan | null> => {
    const existingPlan = await this.planRepository.findById(id);
    if (!existingPlan) {
      throw new Error('Plan not found');
    }
    return this.planRepository.softDelete(id);
  };
}
