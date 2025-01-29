import { Router } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { ContentController } from "../controllers/content.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const contentController = container.get<ContentController>(TYPES.ContentController);

router.get("/posts", authenticate, (req, res) =>
  contentController.getAllContent(req, res)
);

router.post("/posts", authenticate, (req, res) =>
  contentController.createContent(req, res)
);

export default router;
