import { Router } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { AuthController } from "../controllers/auth.controller";
import { validateRefreshToken } from "../middlewares/auth.middleware";

const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

router.post("/register", (req, res) => authController.register(req, res));
router.post("/verify-otp", (req, res) => authController.verifyOTP(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.post("/refresh-token", validateRefreshToken, (req, res) =>
  authController.refreshToken(req, res)
);
router.post("/google", (req, res) => authController.googleAuth(req, res));

router.get("/verify-token", (req, res) => authController.verifyToken(req, res));

router.get("/logout", (req, res) => authController.logout(req, res));

export default router;
