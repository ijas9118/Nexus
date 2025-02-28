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

router.get("/", authenticate(["user", "admin"]), contentController.getAllContent);

router.post("/", authenticate(["user"]), contentController.createContent);

router.get("/:id", authenticate(["user", "admin"]), contentController.getContent);

router.post("/:id/like", authenticate(["user"]), likesController.toggleLike);

router.post("/:id/bookmark", authenticate(["user"]), bookmarkController.toggleBookmark);

router.get("/bookmarks", bookmarkController.getAllBookmarks);
export default router;
