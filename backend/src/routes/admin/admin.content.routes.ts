import { Router } from "express";

import type { IContentController } from "@/core/interfaces/controllers/i-content-controller";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";

const contentController = container.get<IContentController>(TYPES.ContentController);

const router = Router();

router.get("/", contentController.getPosts);

export default router;
