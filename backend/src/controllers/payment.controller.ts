import type { Request, Response } from 'express';

import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import type { IPaymentController } from '@/core/interfaces/controllers/i-payment-controller';
import type { IPaymentService } from '@/core/interfaces/services/i-payment-service';

import { TYPES } from '@/di/types';

@injectable()
export class PaymentController implements IPaymentController {
  constructor(@inject(TYPES.PaymentService) private _paymentService: IPaymentService) {}

  checkoutSession = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { planId, price, tier, email } = req.body;
    const customerId = req.user?._id as string;
    const sessionUrl = await this._paymentService.checkoutSession(
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
    await this._paymentService.webhookHandler(req.body, signature);
    res.status(StatusCodes.OK).json({ received: true });
  });

  verifySession = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { sessionId } = req.params;

    if (!sessionId || typeof sessionId !== 'string') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Missing sessionId' });
      return;
    }

    const isValid = await this._paymentService.verifyCheckoutSession(sessionId);
    res.status(StatusCodes.OK).json({ success: isValid });
  });
}
