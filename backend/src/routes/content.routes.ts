import { Router } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { ContentController } from "../controllers/content.controller";

const router = Router();
const contentController = container.get<ContentController>(TYPES.ContentController);

router.post("/:id/like", (req, res) => contentController.likeContent(req, res));
router.post("/:id/unlike", (req, res) => contentController.unlikeContent(req, res));

export default router;
