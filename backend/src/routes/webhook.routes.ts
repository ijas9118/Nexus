import express, { Router } from 'express';
import { container } from '../di/container';
import { IPaymentController } from '../core/interfaces/controllers/IPaymentController';
import { TYPES } from '../di/types';

const router = Router();

const paymentController = container.get<IPaymentController>(TYPES.PaymentController);

router.post('/', express.raw({ type: 'application/json' }), (req, res, next) => {
  paymentController.handleWebhook(req, res, next);
});

export default router;
