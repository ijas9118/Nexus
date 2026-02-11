import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import type { ITargetAudienceController } from "@/core/interfaces/controllers/i-target-audience-controller";
import type { ITargetAudienceService } from "@/core/interfaces/services/i-target-audience-service";

import { TYPES } from "@/di/types";
import CustomError from "@/utils/custom-error";

@injectable()
export class TargetAudienceController implements ITargetAudienceController {
  constructor(@inject(TYPES.TargetAudienceService) private service: ITargetAudienceService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const targetAudience = await this.service.create(req.body);
    res.status(201).json({
      success: true,
      data: targetAudience,
    });
  });

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const isAdmin = req.user?.role === "admin";
    const includeAll = isAdmin && req.query.all === "true";

    const query = includeAll ? {} : { isActive: true };
    const targetAudiences = await this.service.find(query);
    res.status(200).json(targetAudiences);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const targetAudience = await this.service.findById(req.params.id as string);
    if (!targetAudience) {
      throw new CustomError("Target audience not found");
    }
    res.json({
      success: true,
      data: targetAudience,
    });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const targetAudience = await this.service.update(req.params.id as string, req.body);
    if (!targetAudience) {
      throw new CustomError("Target audience not found");
    }
    res.json({
      success: true,
      data: targetAudience,
    });
  });

  softDelete = asyncHandler(async (req: Request, res: Response) => {
    const targetAudience = await this.service.softDelete(req.params.id as string);
    if (!targetAudience) {
      throw new CustomError("Target audience not found");
    }
    res.json({
      success: true,
      data: targetAudience,
    });
  });

  restore = asyncHandler(async (req: Request, res: Response) => {
    const targetAudience = await this.service.restore(req.params.id as string);
    if (!targetAudience) {
      throw new CustomError("Target audience not found");
    }
    res.json({
      success: true,
      data: targetAudience,
    });
  });
}
