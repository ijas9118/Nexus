import { Router } from "express";
import { container } from "../../di/container";
import { ContentController } from "../../controllers/content.controller";
import { TYPES } from "../../di/types";
import { LikesController } from "../../controllers/likes.controller";
import { BookmarkController } from "../../controllers/bookmark.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();
const contentController = container.get<ContentController>(TYPES.ContentController);
const likesController = container.get<LikesController>(TYPES.LikesController);
const bookmarkController = container.get<BookmarkController>(TYPES.BookmarkController);

router.get("/", authenticate(["user", "admin"]), (req, res) =>
  contentController.getAllContent(req, res)
);

router.post("/", authenticate(["user"]), (req, res) =>
  contentController.createContent(req, res)
);

router.get("/:id", authenticate(["user", "admin"]), (req, res) =>
  contentController.getContent(req, res)
);

router.post("/:id/like", authenticate(["user"]), (req, res) =>
  likesController.toggleLike(req, res)
);

router.post("/:id/bookmark", authenticate(["user"]), (req, res) =>
  bookmarkController.toggleBookmark(req, res)
);

router.get("/bookmarks", authenticate(["user"]), (req, res) =>
  bookmarkController.getAllBookmarks(req, res)
);
export default router;
