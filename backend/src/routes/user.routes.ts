import { Router } from "express";

import type { UserController } from "@/controllers/user.controller";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { authenticate } from "@/middlewares/auth.middleware";
import upload from "@/middlewares/multer";

const userController = container.get<UserController>(TYPES.UserController);
const router = Router();

router.get(
  "/squads",
  authenticate(["user", "premium", "mentor"]),
  userController.getUserJoinedSquads,
);

router.post("/update", authenticate(["user", "premium", "mentor"]), userController.updateUser);

router.post(
  "/update/password",
  authenticate(["user", "premium", "mentor"]),
  userController.updatePassword,
);

router.put(
  "/update/profile-pic",
  authenticate(["user", "premium", "mentor"]),
  upload.single("profilePic"),
  userController.updateProfilePic,
);

router.get("/:username", userController.getUserData);

router.post(
  "/contents",
  authenticate(["user", "premium", "mentor"]),
  userController.getUserContents,
);

router.get("/check-username/:username", userController.validateUsername);

export default router;
