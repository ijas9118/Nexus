import { injectable } from 'inversify';
import { IPlan, PlanModel } from '@/models/plan.model';
import { BaseRepository } from '@/core/abstracts/base.repository';
import { IPlanRepository } from '@/core/interfaces/repositories/IPlanRepository';

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
