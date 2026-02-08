import { inject, injectable } from 'inversify';

import type { IPlanRepository } from '@/core/interfaces/repositories/i-plan-repository';
import type { IPlanService } from '@/core/interfaces/services/i-plan-service';
import type { IPlan } from '@/models/plan.model';

import { TYPES } from '@/di/types';

@injectable()
export class PlanService implements IPlanService {
  constructor(@inject(TYPES.PlanRepository) private planRepository: IPlanRepository) {}

  createPlan = async (data: Partial<IPlan>): Promise<IPlan> => {
    const existingPlan = await this.planRepository.findOne({ tier: data.tier });
    if (existingPlan) {
      throw new Error('Plan with this tier already exists');
    }
    // Ensure interval is provided
    if (!data.interval) {
      throw new Error('Interval is required');
    }

    if (data.price! < 0) throw new Error('Price cannot be negative');
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
