import { Router } from "express";

import type { INotificationTypeController } from "@/core/interfaces/controllers/i-notification-type-controller";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();
const notificationTypeController = container.get<INotificationTypeController>(
  TYPES.NotificationTypeController,
);

router.post("/", authenticate(["admin"]), notificationTypeController.createNotificationType);

router.get("/", authenticate(["admin"]), notificationTypeController.getNotificationTypes);

router.put("/:id", authenticate(["admin"]), notificationTypeController.updateNotificationType);

router.delete("/:id", authenticate(["admin"]), notificationTypeController.deleteNotificationType);

router.patch(
  "/:id/restore",
  authenticate(["admin"]),
  notificationTypeController.restoreNotificationType,
);

export default router;
