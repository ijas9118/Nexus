import { IPaymentController } from '@/core/interfaces/controllers/IPaymentController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';
import { Router } from 'express';

const router = Router();

const paymentController = container.get<IPaymentController>(TYPES.PaymentController);

router.post(
  '/create-checkout-session',
  authenticate(['user', 'premium', 'mentor']),
  paymentController.checkoutSession
);

router.get(
  '/verify-session/:sessionId',
  authenticate(['user', 'mentor', 'premium']),
  paymentController.verifySession
);

export default router;
