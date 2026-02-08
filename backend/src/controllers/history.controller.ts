import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IHistoryController } from "@/core/interfaces/controllers/i-history-controller";
import type { IHistoryService } from "@/core/interfaces/services/i-history-service";

import { TYPES } from "@/di/types";
import CustomError from "@/utils/custom-error";

@injectable()
export class HistoryController implements IHistoryController {
  constructor(@inject(TYPES.HistoryService) private _historyService: IHistoryService) {}

  removeFromHistory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const { contentId } = req.body;

    if (!contentId) {
      throw new CustomError("Content ID is required", StatusCodes.BAD_REQUEST);
    }

    const result = await this._historyService.removeFromHistory(userId, contentId);

    if (!result) {
      throw new CustomError("Failed to remove from history", StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.OK).json({ message: "Removed from history" });
  });

  getAllHistory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;

    const history = await this._historyService.getAllHistory(userId);

    if (!history) {
      throw new CustomError("Failed to fetch history", StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.OK).json(history);
  });
}
