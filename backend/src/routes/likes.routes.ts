import { Router } from "express";
import { container } from "../di/container";
import { LikesController } from "../controllers/likes.controller";
import { TYPES } from "../di/types";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

const likesController = container.get<LikesController>(TYPES.LikesController);

router.post("/posts/:id/like", authenticate, (req, res) =>
  likesController.toggleLike(req, res)
);

router.get("/posts/:id/like", authenticate, (req, res) =>
  likesController.getLikesByContent(req, res)
);

export default router;
