import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { IPlanService } from '../core/interfaces/services/IPlanService';
import { IPlanController } from '../core/interfaces/controllers/IPlanController';
import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';

@injectable()
export class PlanController implements IPlanController {
  constructor(@inject(TYPES.PlanService) private planService: IPlanService) {}

  createPlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const plan = await this.planService.createPlan(req.body);
    res.status(201).json(plan);
  });

  getAllPlans = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const plans = await this.planService.getAllPlans();
    res.status(StatusCodes.OK).json(plans);
  });

  getPlanById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const plan = await this.planService.getPlanById(req.params.id);
    if (!plan) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Plan not found' });
      return;
    }
    res.status(StatusCodes.OK).json(plan);
  });

  updatePlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const plan = await this.planService.updatePlan(req.params.id, req.body);
    if (!plan) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Plan not found' });
      return;
    }
    res.status(StatusCodes.OK).json(plan);
  });

  deletePlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const plan = await this.planService.softDeletePlan(req.params.id);
    if (!plan) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Plan not found' });
      return;
    }
    res.status(StatusCodes.OK).json({ message: 'Plan deleted successfully' });
  });
}
