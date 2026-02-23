import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { ISubscriptionController } from "@/core/interfaces/controllers/i-subscription-controller";
import type { ISubscriptionService } from "@/core/interfaces/services/i-subscription-service";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { PAYMENT_MESSAGES } = MESSAGES;

@injectable()
export class SubscriptionController implements ISubscriptionController {
  constructor(
    @inject(TYPES.SubscriptionService) private _subscriptionService: ISubscriptionService,
  ) {}

  getCurrentSubscription = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;

    const subscription = await this._subscriptionService.getUserSubscription(userId);
    if (!subscription) {
      throw new CustomError(PAYMENT_MESSAGES.NO_SUBSCRIPTION, StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json(subscription);
  });
}
