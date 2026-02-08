import express, { Router } from 'express';

import type { IPaymentController } from '../core/interfaces/controllers/i-payment-controller';

import { container } from '../di/container';
import { TYPES } from '../di/types';

const router = Router();

const paymentController = container.get<IPaymentController>(TYPES.PaymentController);

router.post('/', express.raw({ type: 'application/json' }), (req, res, next) => {
  paymentController.handleWebhook(req, res, next);
});

export default router;
