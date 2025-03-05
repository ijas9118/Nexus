import { Response } from 'express';
import { IHistoryController } from '../core/interfaces/controllers/IHistoryController';
import { CustomRequest } from '../core/types/CustomRequest';
import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import { IHistoryService } from '../core/interfaces/services/IHistoryService';
import asyncHandler from 'express-async-handler';
import CustomError from '../utils/CustomError';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class HistoryController implements IHistoryController {
  constructor(@inject(TYPES.HistoryService) private historyService: IHistoryService) {}

  removeFromHistory = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { contentId } = req.body;

    if (!contentId) throw new CustomError('Content ID is required', StatusCodes.BAD_REQUEST);

    const result = await this.historyService.removeFromHistory(userId, contentId);

    if (!result)
      throw new CustomError('Failed to remove from history', StatusCodes.INTERNAL_SERVER_ERROR);

    res.status(StatusCodes.OK).json({ message: 'Removed from history' });
  });

  getAllHistory = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.user?._id as string;

    const history = await this.historyService.getAllHistory(userId);

    if (!history)
      throw new CustomError('Failed to fetch history', StatusCodes.INTERNAL_SERVER_ERROR);

    res.status(StatusCodes.OK).json(history);
  });
}
