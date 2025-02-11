import { Router } from "express";
import adminAuthRoutes from "./admin/admin.auth.route";
import adminUserRoutes from "./admin/admin.users.route";
import adminCategoryRoutes from "./admin/admin.category.route";
import adminSquadRoutes from "./admin/admin.squad.route";
import mentorRoute from "./admin/admin.mentor.routes";

const router = Router();

router.use("/", adminAuthRoutes);
router.use("/user", adminUserRoutes);
router.use("/category", adminCategoryRoutes);
router.use("/squad", adminSquadRoutes);
router.use("/mentor", mentorRoute);

export default router;
