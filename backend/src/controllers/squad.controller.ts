import { Request, Response } from 'express';
import { ISquadController } from '../core/interfaces/controllers/ISquadController';
import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import { CustomRequest } from '../core/types/CustomRequest';
import { ISquadService } from '../core/interfaces/services/ISquadService';
import asyncHandler from 'express-async-handler';
import CustomError from '../utils/CustomError';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class SquadController implements ISquadController {
  constructor(@inject(TYPES.SquadService) private squadService: ISquadService) {}

  createSquad = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const existingSquad = await this.squadService.getSquadByName(req.body.name);
    if (existingSquad) {
      throw new CustomError('Squad with this name already exists', StatusCodes.BAD_REQUEST);
    }

    const squad = await this.squadService.createSquad(req.body);
    res.status(StatusCodes.CREATED).json(squad);
  });

  getAllSquads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const squads = await this.squadService.getAllSquads();
    res.status(StatusCodes.OK).json(squads);
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

  getSquadsByCategory = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const category = req.query.category as string;
    if (!category) {
      throw new CustomError('Category is required', StatusCodes.BAD_REQUEST);
    }

    const squads = await this.squadService.getSquadsByCategory(userId, category);
    res.status(StatusCodes.OK).json(squads);
  });

  joinSquad = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { squadId } = req.params;

    if (!userId) {
      throw new CustomError('User ID is required', StatusCodes.BAD_REQUEST);
    }

    await this.squadService.joinSquad(userId, squadId);
    res.status(StatusCodes.OK).json({ message: 'Successfully joined squad' });
  });
}
