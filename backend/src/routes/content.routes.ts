import { Router } from "express";
import postsRoutes from "./content/posts.routes";
import historyRoutes from "./content/history.routes";

const router = Router();

router.use("/posts", postsRoutes);
router.use("/history", historyRoutes);

export default router;
