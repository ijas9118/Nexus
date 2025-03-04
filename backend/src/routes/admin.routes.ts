import { Router } from "express";
import adminAuthRoutes from "./admin/admin.auth.routes";
import adminUserRoutes from "./admin/admin.users.routes";
import adminCategoryRoutes from "./admin/admin.category.routes";
import adminSquadRoutes from "./admin/admin.squad.routes";
import mentorRoute from "./admin/admin.mentor.routes";
import adminCommentRoutes from "./admin/admin.comment.routes";

const router = Router();

router.use("/", adminAuthRoutes);
router.use("/user", adminUserRoutes);
router.use("/category", adminCategoryRoutes);
router.use("/squad", adminSquadRoutes);
router.use("/mentor", mentorRoute);
router.use("/comment", adminCommentRoutes);

export default router;
