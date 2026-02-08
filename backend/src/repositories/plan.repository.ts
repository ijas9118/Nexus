import { injectable } from 'inversify';

import type { IPlanRepository } from '@/core/interfaces/repositories/i-plan-repository';
import type { IPlan } from '@/models/plan.model';

import { BaseRepository } from '@/core/abstracts/base.repository';
import { PlanModel } from '@/models/plan.model';

@injectable()
export class PlanRepository extends BaseRepository<IPlan> implements IPlanRepository {
  constructor() {
    super(PlanModel);
  }

  async softDelete(planId: string): Promise<IPlan | null> {
    return this.findByIdAndUpdate(planId, { isActive: false });
  }

  async findActivePlans(): Promise<IPlan[]> {
    return this.model.find({ isActive: true });
  }
}
