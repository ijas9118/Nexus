import { Router } from "express";
import adminAuthRoutes from "./admin/admin.auth.route";
import adminUserRoutes from "./admin/admin.users.route";

const router = Router();

router.use("/", adminAuthRoutes);
router.use("/user", adminUserRoutes);
// router.use("/category", adminCategoryRoutes)

export default router;
