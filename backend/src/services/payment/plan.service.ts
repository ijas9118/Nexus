import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IPlanRepository } from "@/core/interfaces/repositories/i-plan-repository";
import type { IPlanService } from "@/core/interfaces/services/i-plan-service";
import type { IPlan } from "@/models/subscription/plan.model";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { PAYMENT_MESSAGES } = MESSAGES;

interface NormalizedPlanData {
  tier: string;
  description: string;
  price: number;
  interval: string;
  durationInDays: number;
  ctaText: string;
  highlights: string[];
  logo: string;
  featured: boolean;
}

type NormalizedPlanUpdateData = Partial<NormalizedPlanData> & { isActive?: boolean };

@injectable()
export class PlanService implements IPlanService {
  constructor(@inject(TYPES.PlanRepository) private _planRepository: IPlanRepository) {}

  createPlan = async (data: Partial<IPlan>): Promise<IPlan> => {
    const normalizedPlan = this.validateAndNormalizeCreateData(data);
    const existingPlan = await this.findByTierCaseInsensitive(normalizedPlan.tier);

    if (existingPlan) {
      throw new CustomError(PAYMENT_MESSAGES.PLAN_EXISTS, StatusCodes.CONFLICT);
    }

    return this._planRepository.create(normalizedPlan);
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

    const normalizedData = this.validateAndNormalizeUpdateData(data);

    if (normalizedData.tier) {
      const duplicatedPlan = await this.findByTierCaseInsensitive(normalizedData.tier);
      if (duplicatedPlan && duplicatedPlan._id.toString() !== id) {
        throw new CustomError(PAYMENT_MESSAGES.PLAN_EXISTS, StatusCodes.CONFLICT);
      }
    }

    return this._planRepository.update(id, normalizedData);
  };

  softDeletePlan = async (id: string): Promise<IPlan | null> => {
    const existingPlan = await this._planRepository.findById(id);
    if (!existingPlan) {
      throw new CustomError(PAYMENT_MESSAGES.PLAN_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    return this._planRepository.softDelete(id);
  };

  private validateAndNormalizeCreateData(data: Partial<IPlan>): NormalizedPlanData {
    const tier = this.normalizeNonEmptyString(data.tier, "Tier is required");
    const description = this.normalizeNonEmptyString(
      data.description,
      "Description is required",
    );
    const ctaText = this.normalizeNonEmptyString(data.ctaText, "CTA text is required");
    const logo = this.normalizeNonEmptyString(data.logo, "Logo is required");
    const interval = this.normalizeInterval(data.interval);
    const highlights = this.normalizeHighlights(data.highlights);
    const price = this.normalizePrice(data.price);

    const featured = this.normalizeOptionalBoolean(data.featured, false, "Featured must be a boolean value");

    return {
      tier,
      description,
      price,
      interval,
      durationInDays: this.getDurationInDays(interval),
      ctaText,
      highlights,
      logo,
      featured,
    };
  }

  private validateAndNormalizeUpdateData(data: Partial<IPlan>): NormalizedPlanUpdateData {
    const normalizedData: NormalizedPlanUpdateData = {};

    if (data.tier !== undefined) {
      normalizedData.tier = this.normalizeNonEmptyString(data.tier, "Tier cannot be empty");
    }
    if (data.description !== undefined) {
      normalizedData.description = this.normalizeNonEmptyString(
        data.description,
        "Description cannot be empty",
      );
    }
    if (data.ctaText !== undefined) {
      normalizedData.ctaText = this.normalizeNonEmptyString(data.ctaText, "CTA text cannot be empty");
    }
    if (data.logo !== undefined) {
      normalizedData.logo = this.normalizeNonEmptyString(data.logo, "Logo cannot be empty");
    }
    if (data.price !== undefined) {
      normalizedData.price = this.normalizePrice(data.price);
    }
    if (data.interval !== undefined) {
      const interval = this.normalizeInterval(data.interval);
      normalizedData.interval = interval;
      normalizedData.durationInDays = this.getDurationInDays(interval);
    }
    if (data.highlights !== undefined) {
      normalizedData.highlights = this.normalizeHighlights(data.highlights);
    }
    if (data.featured !== undefined) {
      if (typeof data.featured !== "boolean") {
        throw new CustomError("Featured must be a boolean value", StatusCodes.BAD_REQUEST);
      }
      normalizedData.featured = data.featured;
    }
    if (data.isActive !== undefined) {
      if (typeof data.isActive !== "boolean") {
        throw new CustomError("isActive must be a boolean value", StatusCodes.BAD_REQUEST);
      }
      normalizedData.isActive = data.isActive;
    }

    if (Object.keys(normalizedData).length === 0) {
      throw new CustomError("No valid fields provided for update", StatusCodes.BAD_REQUEST);
    }

    return normalizedData;
  }

  private normalizeNonEmptyString(value: unknown, message: string): string {
    if (typeof value !== "string" || !value.trim()) {
      throw new CustomError(message, StatusCodes.BAD_REQUEST);
    }
    return value.trim();
  }

  private normalizePrice(value: unknown): number {
    if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
      throw new CustomError("Valid price is required", StatusCodes.BAD_REQUEST);
    }
    if (value < 0) {
      throw new CustomError("Price cannot be negative", StatusCodes.BAD_REQUEST);
    }
    return value;
  }

  private normalizeInterval(value: unknown): string {
    if (typeof value !== "string" || !value.trim()) {
      throw new CustomError(PAYMENT_MESSAGES.INTERVAL_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const normalizedInterval = value.trim().replace(/\s+/g, " ").toLowerCase();
    const isValidInterval = /^\d*\s*(?:month|months)$/.test(normalizedInterval);
    if (!isValidInterval) {
      throw new CustomError(
        "Invalid interval. Use 'month' or '<number> months'",
        StatusCodes.BAD_REQUEST,
      );
    }

    return normalizedInterval;
  }

  private normalizeHighlights(value: unknown): string[] {
    if (!Array.isArray(value)) {
      throw new CustomError("Highlights must be an array", StatusCodes.BAD_REQUEST);
    }

    const normalizedHighlights = value
      .map(item => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);

    if (normalizedHighlights.length === 0) {
      throw new CustomError("At least one highlight is required", StatusCodes.BAD_REQUEST);
    }

    return normalizedHighlights;
  }

  private getDurationInDays(interval: string): number {
    const match = interval.match(/^(\d+)?\s*(month|months)$/);
    const numberOfMonths = match?.[1] ? Number.parseInt(match[1], 10) : 1;
    return numberOfMonths * 30;
  }

  private async findByTierCaseInsensitive(tier: string): Promise<IPlan | null> {
    const escapedTier = tier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return this._planRepository.findOne({
      tier: { $regex: `^${escapedTier}$`, $options: "i" },
    });
  }

  private normalizeOptionalBoolean(
    value: unknown,
    defaultValue: boolean,
    errorMessage: string,
  ): boolean {
    if (value === undefined) {
      return defaultValue;
    }
    if (typeof value !== "boolean") {
      throw new CustomError(errorMessage, StatusCodes.BAD_REQUEST);
    }
    return value;
  }
}
