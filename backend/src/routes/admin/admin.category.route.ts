import { Router } from "express";
import { container } from "../../di/container";
import { CategoryController } from "../../controllers/category.controller";
import { TYPES } from "../../di/types";

const categoryController = container.get<CategoryController>(TYPES.CategoryController);

const router = Router();

router.post("/", categoryController.createCategory);

export default router;
