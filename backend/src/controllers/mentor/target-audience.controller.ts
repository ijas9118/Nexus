import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { ITargetAudienceController } from "@/core/interfaces/controllers/i-target-audience-controller";
import type { ITargetAudienceService } from "@/core/interfaces/services/i-target-audience-service";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { MENTOR_MESSAGES } = MESSAGES;

@injectable()
export class TargetAudienceController implements ITargetAudienceController {
  constructor(@inject(TYPES.TargetAudienceService) private service: ITargetAudienceService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const targetAudience = await this.service.create(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      data: targetAudience,
    });
  });

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const isAdmin = req.user?.role === "admin";
    const includeAll = isAdmin && req.query.all === "true";

    const query = includeAll ? {} : { isActive: true };
    const targetAudiences = await this.service.find(query);
    res.status(StatusCodes.OK).json(targetAudiences);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const targetAudience = await this.service.findById(req.params.id as string);
    if (!targetAudience) {
      throw new CustomError(MENTOR_MESSAGES.TARGET_AUDIENCE_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json({
      success: true,
      data: targetAudience,
    });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const targetAudience = await this.service.update(req.params.id as string, req.body);
    if (!targetAudience) {
      throw new CustomError(MENTOR_MESSAGES.TARGET_AUDIENCE_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json({
      success: true,
      data: targetAudience,
    });
  });

  softDelete = asyncHandler(async (req: Request, res: Response) => {
    const targetAudience = await this.service.softDelete(req.params.id as string);
    if (!targetAudience) {
      throw new CustomError(MENTOR_MESSAGES.TARGET_AUDIENCE_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json({
      success: true,
      data: targetAudience,
    });
  });

  restore = asyncHandler(async (req: Request, res: Response) => {
    const targetAudience = await this.service.restore(req.params.id as string);
    if (!targetAudience) {
      throw new CustomError(MENTOR_MESSAGES.TARGET_AUDIENCE_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json({
      success: true,
      data: targetAudience,
    });
  });
}
