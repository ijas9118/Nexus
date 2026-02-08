import { Router } from 'express';

import type { IBookingPaymentController } from '@/core/interfaces/controllers/i-booking-payment-controller';

import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();
const bookingPaymentController = container.get<IBookingPaymentController>(
  TYPES.BookingPaymentController
);

router.post(
  '/create-booking-checkout-session',
  authenticate(['user', 'premium']),
  bookingPaymentController.checkoutSession
);

router.get(
  '/verify-booking-session/:sessionId',
  authenticate(['user', 'premium']),
  bookingPaymentController.verifySession
);

export default router;
