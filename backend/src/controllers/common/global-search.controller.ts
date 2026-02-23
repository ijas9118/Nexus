import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IGlobalSearchController } from "@/core/interfaces/controllers/i-global-search-controller";
import type { IGlobalSearchService } from "@/core/interfaces/services/i-global-search-service";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { SEARCH_MESSAGES } = MESSAGES;

@injectable()
export class GlobalSearchController implements IGlobalSearchController {
  constructor(
    @inject(TYPES.GlobalSearchService) private _globalSearchService: IGlobalSearchService,
  ) {}

  search = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = req.query.q as string;
    const limit = req.query.limit ? Number.parseInt(req.query.limit as string, 10) : 20;

    if (!query) {
      throw new CustomError(SEARCH_MESSAGES.QUERY_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    try {
      const results = await this._globalSearchService.search({ query, limit });
      res.status(StatusCodes.OK).json(results);
    }
    catch {
      throw new CustomError(SEARCH_MESSAGES.SEARCH_FAILED, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  });
}
