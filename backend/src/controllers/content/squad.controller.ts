import type { Express, Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { ISquadController } from "@/core/interfaces/controllers/i-squad-controller";
import type { ISquadService } from "@/core/interfaces/services/i-squad-service";

import logger from "@/config/logger";
import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { SQUAD_MESSAGES } = MESSAGES;

@injectable()
export class SquadController implements ISquadController {
  constructor(@inject(TYPES.SquadService) private _squadService: ISquadService) {}

  createSquad = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const existingSquad = await this._squadService.getSquadByName(req.body.name);
    if (existingSquad) {
      throw new CustomError(SQUAD_MESSAGES.EXISTS, StatusCodes.BAD_REQUEST);
    }

    const logoFile = req.file as Express.Multer.File | undefined;
    const squadData = {
      ...req.body,
      logo: undefined,
    };

    const squad = await this._squadService.createSquad(squadData, logoFile);
    res.status(StatusCodes.CREATED).json(squad);
  });

  getAllSquads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { limit = "10", page = "1", search = "" } = req.query; // Default values
    const limitNum = Number.parseInt(limit as string, 10);
    const pageNum = Number.parseInt(page as string, 10);

    if (Number.isNaN(limitNum) || limitNum < 1) {
      throw new CustomError(SQUAD_MESSAGES.INVALID_LIMIT, StatusCodes.BAD_REQUEST);
    }
    if (Number.isNaN(pageNum) || pageNum < 1) {
      throw new CustomError(SQUAD_MESSAGES.INVALID_PAGE, StatusCodes.BAD_REQUEST);
    }

    const squads = await this._squadService.getAllSquads({
      limit: limitNum,
      page: pageNum,
      search: search as string,
    });

    res.status(StatusCodes.OK).json({
      data: squads,
      meta: {
        limit: limitNum,
        page: pageNum,
        total: squads.length,
      },
    });
  });

  toggleSquad = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const toggleSquad = await this._squadService.toggleSquad(id as string);
    if (toggleSquad) {
      res.status(StatusCodes.OK).json(toggleSquad);
    }
    else {
      throw new CustomError(SQUAD_MESSAGES.NOT_FOUND, StatusCodes.NOT_FOUND);
    }
  });

  getSquadsByCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const category = req.query.category as string;

    logger.debug("Fetching squads by category", { userId, category });

    if (!category) {
      throw new CustomError(SQUAD_MESSAGES.CATEGORY_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const squads = await this._squadService.getSquadsByCategory(userId, category);
    res.status(StatusCodes.OK).json(squads);
  });

  joinSquad = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { squadId } = req.params;

    if (!userId) {
      throw new CustomError(SQUAD_MESSAGES.USER_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    await this._squadService.joinSquad(userId, squadId as string);
    res.status(StatusCodes.OK).json({ message: SQUAD_MESSAGES.JOIN_SUCCESS });
  });

  leaveSquad = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { squadId } = req.params;

    if (!userId) {
      throw new CustomError(SQUAD_MESSAGES.USER_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    await this._squadService.leaveSquad(userId, squadId as string);
    res.status(StatusCodes.OK).json({ message: SQUAD_MESSAGES.LEAVE_SUCCESS });
  });

  getJoinedSquads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body;

    if (!userId) {
      throw new CustomError(SQUAD_MESSAGES.USER_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const squads = await this._squadService.getJoinedSquads(userId);
    res.status(StatusCodes.OK).json(squads);
  });

  getSquadDetailsByHandle = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { handle } = req.params;
    const userId = req.user?._id as string;

    if (!handle) {
      throw new CustomError(SQUAD_MESSAGES.HANDLE_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const squad = await this._squadService.getSquadDetailsByHandle(handle as string, userId);

    if (!squad) {
      throw new CustomError(SQUAD_MESSAGES.NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json(squad);
  });

  getSquadContents = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { squadId } = req.params;
    const userId = req.user?._id as string;
    const role = req.user?.role as string;

    if (!squadId) {
      throw new CustomError(SQUAD_MESSAGES.ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const contents = await this._squadService.getSquadContents(squadId as string, role, userId);
    res.status(StatusCodes.OK).json(contents);
  });
}
