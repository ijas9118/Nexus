import { Router } from "express";
import { container } from "../di/container";
import { SquadController } from "../controllers/squad.controller";
import { TYPES } from "../di/types";

const router = Router();

const squadController = container.get<SquadController>(TYPES.SquadController);

router.get("/", squadController.getSquadsByCategory);
router.post('/', squadController.createSquad)

export default router;
