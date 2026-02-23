import { injectable } from "inversify";

import type { IPlanRepository } from "@/core/interfaces/repositories/i-plan-repository";
import type { IPlan } from "@/models/subscription/plan.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { PlanModel } from "@/models/subscription/plan.model";

@injectable()
export class PlanRepository extends BaseRepository<IPlan> implements IPlanRepository {
  constructor() {
    super(PlanModel);
  }

  async softDelete(planId: string): Promise<IPlan | null> {
    return this.update(planId, { isActive: false });
  }

  async findActivePlans(): Promise<IPlan[]> {
    return this._model.find({ isActive: true }).sort({ createdAt: -1 });
  }
}
