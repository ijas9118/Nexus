import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IMentorMetadataController } from "@/core/interfaces/controllers/i-mentor-metadata-controller";
import type { IMentorMetadataService } from "@/core/interfaces/services/i-mentor-metadata-service";
import type { IMentorMetadata } from "@/models/mentor/mentor-metadata.model";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { MENTOR_MESSAGES } = MESSAGES;

@injectable()
export class MentorMetadataController implements IMentorMetadataController {
  constructor(@inject(TYPES.MentorMetadataService) private _service: IMentorMetadataService) {}

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data: Partial<IMentorMetadata> = req.body;
    const metadata = await this._service.create(data);
    res.status(StatusCodes.CREATED).json(metadata);
  });

  findById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const metadata = await this._service.findById(req.params.id as string);
    if (!metadata) {
      throw new CustomError(MENTOR_MESSAGES.META_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json(metadata);
  });

  findAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const isAdmin = req.user?.role === "admin";
    const includeAll = isAdmin && req.query.all === "true";

    const query = includeAll ? {} : { isActive: true };
    const metadata = await this._service.find(query);
    res.status(StatusCodes.OK).json(metadata);
  });

  findByType = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { type } = req.params;
    const isActive = req.query.isActive !== "false";
    const metadata = await this._service.findByType(type as string, isActive);
    res.status(StatusCodes.OK).json(metadata);
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const metadata = await this._service.update(req.params.id as string, req.body);
    if (!metadata) {
      throw new CustomError(MENTOR_MESSAGES.META_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json(metadata);
  });

  softDelete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const metadata = await this._service.softDelete(req.params.id as string);
    if (!metadata) {
      throw new CustomError(MENTOR_MESSAGES.META_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json(metadata);
  });

  restore = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const metadata = await this._service.restore(req.params.id as string);
    if (!metadata) {
      throw new CustomError(MENTOR_MESSAGES.META_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json(metadata);
  });
}
