import { Router } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types"; 
import { AuthController } from "../controllers/auth.controller"; 

const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));

export default router;
