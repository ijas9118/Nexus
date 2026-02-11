import { Router } from "express";

import type { ITimeSlotController } from "@/core/interfaces/controllers/i-time-slot-controller";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { authenticate } from "@/middlewares/auth.middleware";

const timeSlotController = container.get<ITimeSlotController>(TYPES.TimeSlotController);

const router = Router();

router.post("/", authenticate(["mentor"]), timeSlotController.addTimeSlot);
router.delete("/:slotId", authenticate(["mentor"]), timeSlotController.deleteTimeSlot);
router.get("/by-date", authenticate(["mentor"]), timeSlotController.getTimeSlotsByDate);
router.get("/", authenticate(["mentor"]), timeSlotController.getAllTimeSlots);
router.get("/booked-time-slot", authenticate(["mentor"]), timeSlotController.getBookedTimeSlots);
router.get(
  "/:mentorId",
  authenticate(["mentor", "user", "premium", "admin"]),
  timeSlotController.getMentorTimeSlots,
);

export default router;
