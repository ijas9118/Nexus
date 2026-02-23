import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IPlanController } from "@/core/interfaces/controllers/i-plan-controller";
import type { IPlanService } from "@/core/interfaces/services/i-plan-service";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { PAYMENT_MESSAGES } = MESSAGES;
const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

@injectable()
export class PlanController implements IPlanController {
  constructor(@inject(TYPES.PlanService) private _planService: IPlanService) {}

  createPlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const plan = await this._planService.createPlan(req.body);
    res.status(StatusCodes.CREATED).json(plan);
  });

  getAllPlans = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const plans = await this._planService.getAllPlans();
    res.status(StatusCodes.OK).json(plans);
  });

  getPlanById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string | undefined;
    if (!id || !OBJECT_ID_REGEX.test(id)) {
      throw new CustomError(PAYMENT_MESSAGES.PLAN_NOT_FOUND, StatusCodes.BAD_REQUEST);
    }

    const plan = await this._planService.getPlanById(id);
    if (!plan) {
      throw new CustomError(PAYMENT_MESSAGES.PLAN_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json(plan);
  });

  updatePlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string | undefined;
    if (!id || !OBJECT_ID_REGEX.test(id)) {
      throw new CustomError(PAYMENT_MESSAGES.PLAN_NOT_FOUND, StatusCodes.BAD_REQUEST);
    }

    const plan = await this._planService.updatePlan(id, req.body);
    if (!plan) {
      throw new CustomError(PAYMENT_MESSAGES.PLAN_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json(plan);
  });

  deletePlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string | undefined;
    if (!id || !OBJECT_ID_REGEX.test(id)) {
      throw new CustomError(PAYMENT_MESSAGES.PLAN_NOT_FOUND, StatusCodes.BAD_REQUEST);
    }

    const plan = await this._planService.softDeletePlan(id);
    if (!plan) {
      throw new CustomError(PAYMENT_MESSAGES.PLAN_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json({ message: PAYMENT_MESSAGES.PLAN_DELETED });
  });
}
