import { Router } from "express";
import { container } from "../di/container";
import { SquadController } from "../controllers/squad.controller";
import { TYPES } from "../di/types";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

const squadController = container.get<SquadController>(TYPES.SquadController);

router.get("/", squadController.getSquadsByCategory);
router.post("/", squadController.createSquad);
router.post("/:squadId/join", authenticate, squadController.joinSquad);

export default router;
