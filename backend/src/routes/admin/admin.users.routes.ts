import { Router } from "express";
import { AdminController } from "../../controllers/admin/admin.controller";
import { container } from "../../di/container";
import { TYPES } from "../../di/types";

const adminController = container.get<AdminController>(TYPES.AdminController);

const router = Router();

router.get("/", (req, res) => adminController.getUsers(req, res));

export default router;
