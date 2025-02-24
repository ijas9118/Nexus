import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { authenticate } from "../middlewares/auth.middleware";

const userController = container.get<UserController>(TYPES.UserController);
const router = Router();

router.get("/squads", authenticate(["user"]), userController.getUserJoinedSquads);

router.post("/update", authenticate(["user"]), userController.updateUser);

router.post("/update/password", authenticate(["user"]), userController.updatePassword);

router.post("/:username", userController.getUserData);

export default router;
