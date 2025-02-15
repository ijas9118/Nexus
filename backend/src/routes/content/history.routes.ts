import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { container } from "../../di/container";
import { HistoryController } from "../../controllers/history.controller";
import { TYPES } from "../../di/types";

const historyController = container.get<HistoryController>(TYPES.HistoryController);

const router = Router();

router.get("/", authenticate(["user"]), historyController.getAllHistory);

router.post("/remove/", authenticate(["user"]), historyController.removeFromHistory);

export default router;
