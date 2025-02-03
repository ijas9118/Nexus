import { Router } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { AuthController } from "../controllers/auth.controller";
import { validateRefreshToken } from "../middlewares/auth.middleware";

const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOTP);
router.post("/resend-otp", authController.resendOtp);
router.post("/forgot-password", authController.forgotPassword);
router.post('/reset-password', authController.resetPassword)
router.post("/login", authController.login);
router.post("/refresh-token", validateRefreshToken, authController.refreshToken);
router.post("/google", authController.googleAuth);

router.get("/verify-token", authController.verifyToken);

router.get("/logout", authController.logout);

export default router;
