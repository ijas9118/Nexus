import { Request, Response } from 'express';
import { ISquadController } from '../core/interfaces/controllers/ISquadController';
import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import { ISquadService } from '../core/interfaces/services/ISquadService';
import asyncHandler from 'express-async-handler';
import CustomError from '../utils/CustomError';
import { StatusCodes } from 'http-status-codes';
import { Express } from 'express';

@injectable()
export class SquadController implements ISquadController {
  constructor(@inject(TYPES.SquadService) private squadService: ISquadService) {}

  createSquad = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const existingSquad = await this.squadService.getSquadByName(req.body.name);
    if (existingSquad) {
      throw new CustomError('Squad with this name already exists', StatusCodes.BAD_REQUEST);
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
    const { limit = '10', page = '1', search = '' } = req.query; // Default values
    const limitNum = parseInt(limit as string, 10);
    const pageNum = parseInt(page as string, 10);

    if (isNaN(limitNum) || limitNum < 1) {
      throw new CustomError('Invalid limit value', StatusCodes.BAD_REQUEST);
    }
    if (isNaN(pageNum) || pageNum < 1) {
      throw new CustomError('Invalid page value', StatusCodes.BAD_REQUEST);
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
    } else {
      throw new CustomError('Squad not found', StatusCodes.NOT_FOUND);
    }
  });

  getSquadsByCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const category = req.query.category as string;
    console.log(category);
    if (!category) {
      throw new CustomError('Category is required', StatusCodes.BAD_REQUEST);
    }

    const squads = await this.squadService.getSquadsByCategory(userId, category);
    res.status(StatusCodes.OK).json(squads);
  });

  joinSquad = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { squadId } = req.params;

    if (!userId) {
      throw new CustomError('User ID is required', StatusCodes.BAD_REQUEST);
    }

    await this.squadService.joinSquad(userId, squadId);
    res.status(StatusCodes.OK).json({ message: 'Successfully joined squad' });
  });

  leaveSquad = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { squadId } = req.params;

    if (!userId) {
      throw new CustomError('User ID is required', StatusCodes.BAD_REQUEST);
    }

    await this.squadService.leaveSquad(userId, squadId);
    res.status(StatusCodes.OK).json({ message: 'Successfully left squad' });
  });

  getJoinedSquads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body;

    if (!userId) {
      throw new CustomError('User ID is required', StatusCodes.BAD_REQUEST);
    }

    const squads = await this.squadService.getJoinedSquads(userId);
    res.status(StatusCodes.OK).json(squads);
  });

  getSquadDetailsByHandle = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { handle } = req.params;
    const userId = req.user?._id as string;

    if (!handle) {
      throw new CustomError('Squad handle is required', StatusCodes.BAD_REQUEST);
    }

    const squad = await this.squadService.getSquadDetailsByHandle(handle, userId);

    if (!squad) {
      throw new CustomError('Squad not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json(squad);
  });

  getSquadContents = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { squadId } = req.params;
    const userId = req.user?._id as string;
    const role = req.user?.role as string;

    if (!squadId) {
      throw new CustomError('Squad ID is required', StatusCodes.BAD_REQUEST);
    }

    const contents = await this.squadService.getSquadContents(squadId, role, userId);
    res.status(StatusCodes.OK).json(contents);
  });
}
