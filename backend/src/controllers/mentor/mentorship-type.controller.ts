import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IMentorshipTypeController } from "@/core/interfaces/controllers/i-mentorship-type-controller";
import type { IMentorshipTypeService } from "@/core/interfaces/services/i-mentorship-type-service";
import type { CreateMentorshipTypeRequestDto } from "@/dtos/requests/mentorship-type.dto";

import { TYPES } from "@/di/types";

@injectable()
export class MentorshipTypeController implements IMentorshipTypeController {
  constructor(@inject(TYPES.MentorshipTypeService) private _service: IMentorshipTypeService) {}

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const responseDto = await this._service.createMentorshipType(
      req.body as CreateMentorshipTypeRequestDto,
    );
    res.status(StatusCodes.CREATED).json(responseDto);
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const responseDto = await this._service.getMentorshipType(req.params.id as string);
    res.status(StatusCodes.OK).json(responseDto);
  });

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const isAdmin = req.user?.role === "admin";
    const includeAll = isAdmin && req.query.all === "true";

    const responseDtos = await this._service.getAllMentorshipTypes({
      includeInactive: includeAll,
    });

    res.status(StatusCodes.OK).json(responseDtos);
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const responseDto = await this._service.updateMentorshipType(
      req.params.id as string,
      req.body,
    );
    res.status(StatusCodes.OK).json(responseDto);
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this._service.deleteMentorshipType(req.params.id as string);
    res.status(StatusCodes.NO_CONTENT).send();
  });

  restore = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this._service.restoreMentorshipType(req.params.id as string);
    res.status(StatusCodes.NO_CONTENT).send();
  });
}
