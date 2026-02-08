import { Router } from "express";

import type { ICommentController } from "@/core/interfaces/controllers/i-comment-controller";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { authenticate } from "@/middlewares/auth.middleware";

const commentController = container.get<ICommentController>(TYPES.CommentController);

const router = Router();

router.post(
  "/",
  authenticate(["user", "mentor", "premium", "admin"]),
  commentController.addComment,
);

router.get(
  "/",
  authenticate(["user", "premium", "mentor"]),
  commentController.getCommentsByContentId,
);

export default router;
