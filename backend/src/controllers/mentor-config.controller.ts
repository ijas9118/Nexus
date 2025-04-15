import { IMentorshipConfigController } from '@/core/interfaces/controllers/IMentorshipConfigController';
import { IMentorshipConfigService } from '@/core/interfaces/services/IMentorshipConfigService';
import { TYPES } from '@/di/types';
import { IMentorshipConfig } from '@/models/mentorship-config.model';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

@injectable()
export class MentorshipConfigController implements IMentorshipConfigController {
  constructor(
    @inject(TYPES.MentorshipConfigService) private configService: IMentorshipConfigService
  ) {}

  createConfig = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const config: Partial<IMentorshipConfig> = req.body;
    const newConfig = await this.configService.createConfig(config);
    res.status(StatusCodes.CREATED).json(newConfig);
  });

  getConfigsByCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { category } = req.params;
    const configs = await this.configService.getConfigsByCategory(category);
    res.status(StatusCodes.OK).json(configs);
  });

  getAllConfigs = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const configs = await this.configService.getAllConfigs();
    res.status(StatusCodes.OK).json(configs);
  });

  getConfigById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const config = await this.configService.getConfigById(id);
    res.status(StatusCodes.OK).json(config);
  });

  updateConfig = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const config: Partial<IMentorshipConfig> = req.body;
    const updatedConfig = await this.configService.updateConfig(id, config);
    res.status(StatusCodes.OK).json(updatedConfig);
  });

  deleteConfig = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.configService.deleteConfig(id);
    res.status(StatusCodes.NO_CONTENT).json();
  });
}
