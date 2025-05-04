import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { IMentorshipTypeService } from '@/core/interfaces/services/IMentorshipTypeService';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';

@injectable()
export class MentorshipTypeController {
  constructor(@inject(TYPES.MentorshipTypeService) private service: IMentorshipTypeService) {}

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mentorshipType = await this.service.createMentorshipType(req.body);
    res.status(StatusCodes.CREATED).json(mentorshipType);
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mentorshipType = await this.service.getMentorshipType(req.params.id);
    res.status(StatusCodes.OK).json(mentorshipType);
  });

  getAll = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const mentorshipTypes = await this.service.getAllMentorshipTypes();
    res.status(StatusCodes.OK).json(mentorshipTypes);
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mentorshipType = await this.service.updateMentorshipType(req.params.id, req.body);
    res.status(StatusCodes.OK).json(mentorshipType);
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.service.deleteMentorshipType(req.params.id);
    res.status(StatusCodes.NO_CONTENT).send();
  });
}
