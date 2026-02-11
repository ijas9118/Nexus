import { Router } from "express";

import type { ISquadController } from "@/core/interfaces/controllers/i-squad-controller";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { authenticate } from "@/middlewares/auth.middleware";
import upload from "@/middlewares/multer";

const router = Router();

const squadController = container.get<ISquadController>(TYPES.SquadController);

router.get("/", authenticate(["user", "premium", "mentor"]), squadController.getSquadsByCategory);

router.post(
  "/",
  authenticate(["user", "premium", "mentor"]),
  upload.single("logo"),
  squadController.createSquad,
);

router.get(
  "/detail/:handle",
  authenticate(["user", "premium", "mentor", "admin"]),
  squadController.getSquadDetailsByHandle,
);

router.post(
  "/:squadId/join",
  authenticate(["user", "premium", "mentor"]),
  squadController.joinSquad,
);

router.post(
  "/:squadId/leave",
  authenticate(["user", "premium", "mentor"]),
  squadController.leaveSquad,
);

router.get(
  "/:squadId/contents",
  authenticate(["user", "premium", "mentor", "admin"]),
  squadController.getSquadContents,
);

router.post(
  "/joined",
  authenticate(["user", "admin", "mentor", "premium"]),
  squadController.getJoinedSquads,
);

export default router;
