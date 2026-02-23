import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IHistoryController } from "@/core/interfaces/controllers/i-history-controller";
import type { IHistoryService } from "@/core/interfaces/services/i-history-service";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { USER_MESSAGES, CONTENT_MESSAGES } = MESSAGES;

@injectable()
export class HistoryController implements IHistoryController {
  constructor(@inject(TYPES.HistoryService) private _historyService: IHistoryService) {}

  removeFromHistory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { contentId } = req.body;

    if (!contentId) {
      throw new CustomError(CONTENT_MESSAGES.ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const result = await this._historyService.removeFromHistory(userId, contentId);

    if (!result) {
      throw new CustomError(USER_MESSAGES.HISTORY_REMOVE_FAILED, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.OK).json({ message: USER_MESSAGES.HISTORY_REMOVED });
  });

  getAllHistory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;

    const history = await this._historyService.getAllHistory(userId);

    if (!history) {
      throw new CustomError(USER_MESSAGES.HISTORY_FETCH_FAILED, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.OK).json(history);
  });
}
