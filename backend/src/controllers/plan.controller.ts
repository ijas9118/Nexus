import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { IPlan } from '../models/plan.model';
import { StatusCodes } from 'http-status-codes';
import { IPlanService } from '../core/interfaces/services/IPlanService';
import { IPlanController } from '../core/interfaces/controllers/IPlanController';
import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';

@injectable()
export class PlanController implements IPlanController {
  constructor(@inject(TYPES.PlanService) private planService: IPlanService) {}

  createPlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const planData: Partial<IPlan> = req.body;
    const newPlan = await this.planService.create(planData);
    res.status(StatusCodes.CREATED).json({ newPlan });
  });
}
