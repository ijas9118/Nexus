import { Router } from "express";

import type { NotificationController } from "@/controllers/communication/notification.controller";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
const notificationController = container.get<NotificationController>(TYPES.NotificationController);

// Protected routes (require authentication)
// router.post('/', authenticate(['admin']), notificationController.createNotification);
router.get(
  "/:userId",
  authenticate(["admin", "mentor", "premium", "user"]),
  notificationController.getUserNotifications,
);
router.patch(
  "/:id/read",
  authenticate(["admin", "mentor", "premium", "user"]),
  notificationController.markAsRead,
);
router.patch(
  "/:userId/read-all",
  authenticate(["admin", "mentor", "premium", "user"]),
  notificationController.markAllAsRead,
);
router.delete(
  "/:id",
  authenticate(["admin", "mentor", "premium", "user"]),
  notificationController.deleteNotification,
);
router.delete(
  "/",
  authenticate(["admin", "mentor", "premium", "user"]),
  notificationController.deleteManyNotifications,
);

export default router;
