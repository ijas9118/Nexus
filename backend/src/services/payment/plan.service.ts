import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IPlanRepository } from "@/core/interfaces/repositories/i-plan-repository";
import type { IPlanService } from "@/core/interfaces/services/i-plan-service";
import type { IPlan } from "@/models/subscription/plan.model";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { PAYMENT_MESSAGES, MENTOR_MESSAGES } = MESSAGES;

@injectable()
export class PlanService implements IPlanService {
  constructor(@inject(TYPES.PlanRepository) private _planRepository: IPlanRepository) {}

  createPlan = async (data: Partial<IPlan>): Promise<IPlan> => {
    const existingPlan = await this._planRepository.findOne({ tier: data.tier });
    if (existingPlan) {
      throw new CustomError(PAYMENT_MESSAGES.PLAN_EXISTS, StatusCodes.CONFLICT);
    }
    // Ensure interval is provided
    if (!data.interval) {
      throw new CustomError(PAYMENT_MESSAGES.INTERVAL_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    if (data.price! < 0) {
      throw new CustomError(MENTOR_MESSAGES.PRICE_NEGATIVE, StatusCodes.BAD_REQUEST);
    }
    return this._planRepository.create(data);
  };

  getAllPlans = async (): Promise<IPlan[]> => {
    return this._planRepository.findActivePlans();
  };

  getPlanById = async (id: string): Promise<IPlan | null> => {
    return this._planRepository.findById(id);
  };

  updatePlan = async (id: string, data: Partial<IPlan>): Promise<IPlan | null> => {
    const existingPlan = await this._planRepository.findById(id);
    if (!existingPlan) {
      throw new CustomError(PAYMENT_MESSAGES.PLAN_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    return this._planRepository.update(id, { ...data, updatedAt: new Date() });
  };

  softDeletePlan = async (id: string): Promise<IPlan | null> => {
    const existingPlan = await this._planRepository.findById(id);
    if (!existingPlan) {
      throw new CustomError(PAYMENT_MESSAGES.PLAN_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    return this._planRepository.softDelete(id);
  };
}
