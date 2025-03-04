import { Router } from "express";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";
import { IContentController } from "../../core/interfaces/controllers/IContentController";

const contentController = container.get<IContentController>(TYPES.ContentController);

const router = Router();

router.get("/", contentController.getPosts);

export default router;
