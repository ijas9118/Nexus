import { Router } from "express";

import type { IBookingController } from "@/core/interfaces/controllers/i-booking-controller";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

const bookingController = container.get<IBookingController>(TYPES.BookingController);

router.get("/upcoming", authenticate(["mentor", "premium"]), bookingController.getUpcomingBookings);
router.get(
  "/completed",
  authenticate(["mentor", "premium"]),
  bookingController.getCompletedBookings,
);
router.patch(
  "/:bookingId/reschedule",
  authenticate(["mentor"]),
  bookingController.rescheduleBooking,
);
router.get("/filter", authenticate(["mentor"]), bookingController.getFilteredBookings);

router.patch("/:bookingId/confirm", authenticate(["mentor"]), bookingController.confirmBooking);

router.post(
  "/meet",
  authenticate(["user", "premium", "mentor"]),
  bookingController.getBookingByMeetUrl,
);

export default router;
