import { Router } from 'express';
import { authenticate } from '@/middlewares/auth.middleware';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IBookingPaymentController } from '@/core/interfaces/controllers/IBookingPaymentController';

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
