import { Router } from "express";

import type { INotificationTypeController } from "@/core/interfaces/controllers/i-notification-type-controller";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { CreateNotificationTypeRequestDto, UpdateNotificationTypeRequestDto } from "@/dtos/requests/notification-type.dto";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateDto } from "@/middlewares/validate-dto.middleware";

const router = Router();
const notificationTypeController = container.get<INotificationTypeController>(
  TYPES.NotificationTypeController,
);

router.post(
  "/",
  authenticate(["admin"]),
  validateDto(CreateNotificationTypeRequestDto),
  notificationTypeController.createNotificationType,
);

router.get("/", authenticate(["admin"]), notificationTypeController.getNotificationTypes);

router.put(
  "/:id",
  authenticate(["admin"]),
  validateDto(UpdateNotificationTypeRequestDto),
  notificationTypeController.updateNotificationType,
);

router.delete("/:id", authenticate(["admin"]), notificationTypeController.deleteNotificationType);

router.patch(
  "/:id/restore",
  authenticate(["admin"]),
  notificationTypeController.restoreNotificationType,
);

export default router;
