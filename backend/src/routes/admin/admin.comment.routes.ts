import { Router } from "express";
import { container } from "../../di/container";
import { CategoryController } from "../../controllers/category.controller";
import { TYPES } from "../../di/types";
import { ICommentController } from "../../core/interfaces/controllers/ICommentController";

const commentController = container.get<ICommentController>(TYPES.CommentController);

const router = Router();

router.get("/", commentController.getAllComments);

export default router;
