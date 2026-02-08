import { Router } from "express";

import type { ICategoryController } from "@/core/interfaces/controllers/i-category-controller";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";

const categoryController = container.get<ICategoryController>(TYPES.CategoryController);
const router = Router();

router.get("/", categoryController.getAllCategories);

router.post("/:id/toggle", categoryController.toggleCategory);

router.post("/", categoryController.createCategory);

router.post("/update", categoryController.updateCategory);

export default router;
