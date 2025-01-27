import { Router } from "express";
import { container } from "../../di/container";
import { AdminAuthController } from "../../controllers/admin/admin.auth.controller";
import { TYPES } from "../../di/types";
import { validateRefreshToken } from "../../middlewares/auth.middleware";

const adminAuthController = container.get<AdminAuthController>(TYPES.AdminAuthController);

const router = Router();

router.post("/login", (req, res) => adminAuthController.login(req, res));
router.post("/refresh-token", validateRefreshToken, (req, res) =>
  adminAuthController.refreshToken(req, res)
);
router.get("/logout", (req, res) => adminAuthController.logout(req, res));

export default router;
