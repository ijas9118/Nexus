import { ITargetAudienceController } from '@/core/interfaces/controllers/ITargetAudienceController';
import { ITargetAudienceService } from '@/core/interfaces/services/ITargetAudienceService';
import { TYPES } from '@/di/types';
import CustomError from '@/utils/CustomError';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { injectable, inject } from 'inversify';

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
    const isAdmin = req.user?.role === 'admin';
    const includeAll = isAdmin && req.query.all === 'true';

    const query = includeAll ? {} : { isActive: true };
    const targetAudiences = await this.service.find(query);
    res.status(200).json(targetAudiences);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const targetAudience = await this.service.findById(req.params.id);
    if (!targetAudience) {
      throw new CustomError('Target audience not found');
    }
    res.json({
      success: true,
      data: targetAudience,
    });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const targetAudience = await this.service.update(req.params.id, req.body);
    if (!targetAudience) {
      throw new CustomError('Target audience not found');
    }
    res.json({
      success: true,
      data: targetAudience,
    });
  });

  softDelete = asyncHandler(async (req: Request, res: Response) => {
    const targetAudience = await this.service.softDelete(req.params.id);
    if (!targetAudience) {
      throw new CustomError('Target audience not found');
    }
    res.json({
      success: true,
      data: targetAudience,
    });
  });

  restore = asyncHandler(async (req: Request, res: Response) => {
    const targetAudience = await this.service.restore(req.params.id);
    if (!targetAudience) {
      throw new CustomError('Target audience not found');
    }
    res.json({
      success: true,
      data: targetAudience,
    });
  });
}
