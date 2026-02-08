import type { Express, Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import logger from "@/config/logger";

import type { ISquadController } from "../core/interfaces/controllers/i-squad-controller";
import type { ISquadService } from "../core/interfaces/services/i-squad-service";

import { TYPES } from "../di/types";
import CustomError from "../utils/custom-error";

@injectable()
export class SquadController implements ISquadController {
  constructor(@inject(TYPES.SquadService) private squadService: ISquadService) {}

  createSquad = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const existingSquad = await this.squadService.getSquadByName(req.body.name);
    if (existingSquad) {
      throw new CustomError("Squad with this name already exists", StatusCodes.BAD_REQUEST);
    }

    const logoFile = req.file as Express.Multer.File | undefined;
    const squadData = {
      ...req.body,
      logo: undefined,
    };

    const squad = await this.squadService.createSquad(squadData, logoFile);
    res.status(StatusCodes.CREATED).json(squad);
  });

  getAllSquads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { limit = "10", page = "1", search = "" } = req.query; // Default values
    const limitNum = Number.parseInt(limit as string, 10);
    const pageNum = Number.parseInt(page as string, 10);

    if (Number.isNaN(limitNum) || limitNum < 1) {
      throw new CustomError("Invalid limit value", StatusCodes.BAD_REQUEST);
    }
    if (Number.isNaN(pageNum) || pageNum < 1) {
      throw new CustomError("Invalid page value", StatusCodes.BAD_REQUEST);
    }

    const squads = await this.squadService.getAllSquads({
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
    const toggleSquad = await this.squadService.toggleSquad(id);
    if (toggleSquad) {
      res.status(StatusCodes.OK).json(toggleSquad);
    }
    else {
      throw new CustomError("Squad not found", StatusCodes.NOT_FOUND);
    }
  });

  getSquadsByCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const category = req.query.category as string;

    logger.debug("Fetching squads by category", { userId, category });

    if (!category) {
      throw new CustomError("Category is required", StatusCodes.BAD_REQUEST);
    }

    const squads = await this.squadService.getSquadsByCategory(userId, category);
    res.status(StatusCodes.OK).json(squads);
  });

  joinSquad = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { squadId } = req.params;

    if (!userId) {
      throw new CustomError("User ID is required", StatusCodes.BAD_REQUEST);
    }

    await this.squadService.joinSquad(userId, squadId);
    res.status(StatusCodes.OK).json({ message: "Successfully joined squad" });
  });

  leaveSquad = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { squadId } = req.params;

    if (!userId) {
      throw new CustomError("User ID is required", StatusCodes.BAD_REQUEST);
    }

    await this.squadService.leaveSquad(userId, squadId);
    res.status(StatusCodes.OK).json({ message: "Successfully left squad" });
  });

  getJoinedSquads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body;

    if (!userId) {
      throw new CustomError("User ID is required", StatusCodes.BAD_REQUEST);
    }

    const squads = await this.squadService.getJoinedSquads(userId);
    res.status(StatusCodes.OK).json(squads);
  });

  getSquadDetailsByHandle = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { handle } = req.params;
    const userId = req.user?._id as string;

    if (!handle) {
      throw new CustomError("Squad handle is required", StatusCodes.BAD_REQUEST);
    }

    const squad = await this.squadService.getSquadDetailsByHandle(handle, userId);

    if (!squad) {
      throw new CustomError("Squad not found", StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json(squad);
  });

  getSquadContents = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { squadId } = req.params;
    const userId = req.user?._id as string;
    const role = req.user?.role as string;

    if (!squadId) {
      throw new CustomError("Squad ID is required", StatusCodes.BAD_REQUEST);
    }

    const contents = await this.squadService.getSquadContents(squadId, role, userId);
    res.status(StatusCodes.OK).json(contents);
  });
}
