import { Router } from "express";

import type { IMentorDashboardController } from "@/core/interfaces/controllers/i-mentor-dashboard-controller";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";

const mentorController = container.get<IMentorDashboardController>(TYPES.MentorDashboardController);

const router = Router();

router.get("/earnings", mentorController.getEarnings);
router.get("/pending-withdrawals", mentorController.getPendingWithdrawalWithBalance);
router.get("/session-stats", mentorController.getSessionStats);
router.get("/recent-bookings", mentorController.getRecentBookings);

export default router;
