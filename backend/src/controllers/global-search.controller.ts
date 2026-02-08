import type { Request, Response } from 'express';

import asyncHandler from 'express-async-handler';
import { inject, injectable } from 'inversify';

import type { IGlobalSearchController } from '@/core/interfaces/controllers/i-global-search-controller';
import type { IGlobalSearchService } from '@/core/interfaces/services/i-global-search-service';

import { TYPES } from '@/di/types';

@injectable()
export class GlobalSearchController implements IGlobalSearchController {
  constructor(
    @inject(TYPES.GlobalSearchService) private _globalSearchService: IGlobalSearchService
  ) {}

  search = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = req.query.q as string;
    const limit = req.query.limit ? Number.parseInt(req.query.limit as string, 10) : 20;

    if (!query) {
      res.status(400).json({ message: 'Query required' });
    }

    try {
      const results = await this._globalSearchService.search({ query, limit });
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: 'Search failed', error });
    }
  });
}
