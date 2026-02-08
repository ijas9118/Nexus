import { Router } from "express";

import type { IMentorController } from "@/core/interfaces/controllers/i-mentor-controller";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { authenticate } from "@/middlewares/auth.middleware";

import mentorDashboardRoutes from "./mentor-dashboard.routes";

const mentorController = container.get<IMentorController>(TYPES.MentorController);

const router = Router();

router.post("/apply", authenticate(["admin", "user", "premium"]), mentorController.applyAsMentor);

router.get(
  "/get-status",
  authenticate(["admin", "mentor", "premium", "user"]),
  mentorController.getStatus,
);

router.get("/get-mentor-details/:mentorId", mentorController.getMentorDetails);

router.get("/all", mentorController.getApprovedMentors);

router.get("/admin/all", mentorController.getAllMentors);

router.patch("/approve/:mentorId/:userId", authenticate(["admin"]), mentorController.approveMentor);

router.patch("/reject/:mentorId", authenticate(["admin"]), mentorController.rejectMentor);

router.get("/enums", mentorController.getMentorEnums);

router.get(
  "/:mentorId/mentorship-types",
  authenticate(["admin", "mentor", "premium", "user"]),
  mentorController.getMentorshipTypes,
);

router.put(
  "/experience",
  authenticate(["admin", "mentor"]),
  mentorController.updateMentorExperience,
);

router.put(
  "/mentorship-details",
  authenticate(["admin", "mentor"]),
  mentorController.updateMentorshipDetails,
);

router.use("/dashboard", authenticate(["mentor"]), mentorDashboardRoutes);

export default router;
