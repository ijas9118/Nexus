import { Router } from "express";

import commentRoutes from "./comment.routes";
import historyRoutes from "./history.routes";
import postsRoutes from "./posts.routes";

const router = Router();

router.use("/posts", postsRoutes);
router.use("/history", historyRoutes);
router.use("/comment", commentRoutes);

export default router;
