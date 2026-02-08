import type { Request, Response } from 'express';

import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import type { ISubscriptionController } from '@/core/interfaces/controllers/i-subscription-controller';
import type { ISubscriptionService } from '@/core/interfaces/services/i-subscription-service';

import { TYPES } from '@/di/types';

@injectable()
export class SubscriptionController implements ISubscriptionController {
  constructor(
    @inject(TYPES.SubscriptionService) private subscriptionService: ISubscriptionService
  ) {}

  getCurrentSubscription = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;

    const subscription = await this.subscriptionService.getUserSubscription(userId);
    if (!subscription) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'No active subscription found.' });
      return;
    }

    res.status(StatusCodes.OK).json(subscription);
  });
}
