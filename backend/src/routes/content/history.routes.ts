import { Router } from "express";

import type { IHistoryController } from "@/core/interfaces/controllers/i-history-controller";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { authenticate } from "@/middlewares/auth.middleware";

const historyController = container.get<IHistoryController>(TYPES.HistoryController);

const router = Router();

router.get("/", authenticate(["user", "premium", "mentor"]), historyController.getAllHistory);

router.post(
  "/remove/",
  authenticate(["user", "premium", "mentor"]),
  historyController.removeFromHistory,
);

export default router;
