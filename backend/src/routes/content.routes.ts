import { Router } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { ContentController } from "../controllers/content.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { LikesController } from "../controllers/likes.controller";
import { BookmarkController } from "../controllers/bookmark.controller";

const router = Router();
const contentController = container.get<ContentController>(TYPES.ContentController);
const likesController = container.get<LikesController>(TYPES.LikesController);
const bookmarkController = container.get<BookmarkController>(TYPES.BookmarkController);

console.log(12345);

router.get("/", authenticate, (req, res) => contentController.getAllContent(req, res));

router.post("/", authenticate, (req, res) => contentController.createContent(req, res));

router.post("/:id/like", authenticate, (req, res) =>
  likesController.toggleLike(req, res)
);

router.post("/:id/bookmark", authenticate, (req, res) =>
  bookmarkController.toggleBookmark(req, res)
);
export default router;
