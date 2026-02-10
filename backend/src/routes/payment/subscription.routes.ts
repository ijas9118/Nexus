import { Router } from "express";

import type { ISubscriptionController } from "@/core/interfaces/controllers/i-subscription-controller";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { authenticate } from "@/middlewares/auth.middleware";

const subscriptionController = container.get<ISubscriptionController>(TYPES.SubscriptionController);

const router = Router();

router.get(
  "/current",
  authenticate(["admin", "premium", "user"]),
  subscriptionController.getCurrentSubscription,
);

export default router;
