import { injectable } from 'inversify';
import { BaseRepository } from '../core/abstracts/base.repository';
import PlanModel, { IPlan } from '../models/plan.model';
import { IPlanRepository } from '../core/interfaces/repositories/IPlanRepository';

@injectable()
export class PlanRepository extends BaseRepository<IPlan> implements IPlanRepository {
  constructor() {
    super(PlanModel);
  }
}
