import { Router } from "express";

import type { IAdminController } from "@/core/interfaces/controllers/admin/i-admin-controller";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";

const adminController = container.get<IAdminController>(TYPES.AdminController);

const router = Router();

router.get("/", adminController.getUsers);

router.patch("/block/:id", adminController.blockUser);

router.patch("/unblock/:id", adminController.unblockUser);

export default router;
