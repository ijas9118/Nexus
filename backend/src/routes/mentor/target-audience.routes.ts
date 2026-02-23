import { Router } from "express";

import type { ITargetAudienceController } from "@/core/interfaces/controllers/i-target-audience-controller";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { CreateTargetAudienceRequestDto, UpdateTargetAudienceRequestDto } from "@/dtos/requests/target-audience.dto";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateDto } from "@/middlewares/validate-dto.middleware";

const router = Router();
const controller = container.get<ITargetAudienceController>(TYPES.TargetAudienceController);

router.post(
  "/",
  authenticate(["admin"]),
  validateDto(CreateTargetAudienceRequestDto),
  controller.create,
);
router.get("/", authenticate(["admin", "user", "premium", "mentor"]), controller.getAll);
router.get("/:id", authenticate(["admin", "user", "premium", "mentor"]), controller.getById);
router.put(
  "/:id",
  authenticate(["admin"]),
  validateDto(UpdateTargetAudienceRequestDto),
  controller.update,
);
router.delete("/:id", authenticate(["admin"]), controller.softDelete);
router.patch("/:id/restore", authenticate(["admin"]), controller.restore);

export default router;
