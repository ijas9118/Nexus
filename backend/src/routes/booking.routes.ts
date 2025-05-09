import { Router } from 'express';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { IBookingController } from '@/core/interfaces/controllers/IBookingController';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

const bookingController = container.get<IBookingController>(TYPES.BookingController);

router.get('/upcoming', authenticate(['mentor', 'premium']), bookingController.getUpcomingBookings);
router.get(
  '/completed',
  authenticate(['mentor', 'premium']),
  bookingController.getCompletedBookings
);
router.patch(
  '/:bookingId/reschedule',
  authenticate(['mentor']),
  bookingController.rescheduleBooking
);
router.get('/filter', authenticate(['mentor']), bookingController.getFilteredBookings);

router.patch('/:bookingId/confirm', authenticate(['mentor']), bookingController.confirmBooking);

export default router;
