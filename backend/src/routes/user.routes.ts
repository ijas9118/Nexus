import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { authenticate } from "../middlewares/auth.middleware";

const userController = container.get<UserController>(TYPES.UserController);
const router = Router();

router.get("/squads", authenticate, userController.getUserJoinedSquads);

export default router;
