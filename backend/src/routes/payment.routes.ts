import { IPaymentController } from '@/core/interfaces/controllers/IPaymentController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';
import { validateRequest } from '@/middlewares/validate.middleware';
import { checkoutSessionSchema } from '@/validations/payment.schema';
import { Router } from 'express';

const router = Router();

const paymentController = container.get<IPaymentController>(TYPES.PaymentController);

router.post(
  '/create-checkout-session',
  authenticate(['user', 'premium', 'mentor']),
  // validateRequest(checkoutSessionSchema),
  paymentController.checkoutSession
);

router.get(
  '/verify-session/:sessionId',
  authenticate(['user', 'mentor', 'premium']),
  paymentController.verifySession
);

export default router;
