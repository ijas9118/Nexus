import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { IMentorshipTypeService } from '@/core/interfaces/services/IMentorshipTypeService';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IMentorshipTypeController } from '@/core/interfaces/controllers/IMentorshipTypeController';
import { CreateMentorshipTypeRequestDto } from '@/dtos/requests/mentorship-type.dto';
import { MentorshipTypeResponseDto } from '@/dtos/responses/mentorship-type.dto';

@injectable()
export class MentorshipTypeController implements IMentorshipTypeController {
  constructor(@inject(TYPES.MentorshipTypeService) private service: IMentorshipTypeService) {}

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mentorshipType = await this.service.createMentorshipType(
      req.body as CreateMentorshipTypeRequestDto
    );
    const responseDto = MentorshipTypeResponseDto.fromEntity(mentorshipType);
    res.status(StatusCodes.CREATED).json(responseDto);
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mentorshipType = await this.service.getMentorshipType(req.params.id);
    res.status(StatusCodes.OK).json(MentorshipTypeResponseDto.fromEntity(mentorshipType));
  });

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const isAdmin = req.user?.role === 'admin';
    const includeAll = isAdmin && req.query.all === 'true';

    const mentorshipTypes = includeAll
      ? await this.service.getAllMentorshipTypes({ includeInactive: true })
      : await this.service.getAllMentorshipTypes();

    const responseDtos = MentorshipTypeResponseDto.fromEntities(mentorshipTypes);
    res.status(StatusCodes.OK).json(responseDtos);
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mentorshipType = await this.service.updateMentorshipType(req.params.id, req.body);
    res.status(StatusCodes.OK).json(MentorshipTypeResponseDto.fromEntity(mentorshipType));
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.service.deleteMentorshipType(req.params.id);
    res.status(StatusCodes.NO_CONTENT).send();
  });

  restore = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.service.restoreMentorshipType(req.params.id);
    res.status(StatusCodes.NO_CONTENT).send();
  });
}
