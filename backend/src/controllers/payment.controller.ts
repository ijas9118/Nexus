import asyncHandler from 'express-async-handler';
import { IPaymentController } from '../core/interfaces/controllers/IPaymentController';
import { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { IPaymentService } from '../core/interfaces/services/IPaymentService';
import { TYPES } from '../di/types';

@injectable()
export class PaymentController implements IPaymentController {
  constructor(@inject(TYPES.PaymentService) private paymentService: IPaymentService) {}

  checkoutSession = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { planId, price, tier, email } = req.body;
    const customerId = req.user?._id as string;
    const sessionUrl = await this.paymentService.checkoutSession(
      planId,
      tier,
      price,
      customerId,
      email
    );
    res.status(StatusCodes.OK).json(sessionUrl);
  });

  handleWebhook = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const signature = req.headers['stripe-signature'] as string;
    await this.paymentService.webhookHandler(req.body, signature);
    res.status(StatusCodes.OK).json({ received: true });
  });
}
