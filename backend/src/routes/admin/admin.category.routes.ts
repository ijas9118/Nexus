import { ICategoryController } from '@/core/interfaces/controllers/ICategoryController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { validateRequest } from '@/middlewares/validate.middleware';
import {
  createCategorySchema,
  toggleCategorySchema,
  updateCategorySchema,
} from '@/validations/category.schema';
import { Router } from 'express';

const categoryController = container.get<ICategoryController>(TYPES.CategoryController);
const router = Router();

router.get('/', categoryController.getAllCategories);

router.post(
  '/:id/toggle',
  validateRequest(toggleCategorySchema),
  categoryController.toggleCategory
);

router.post('/', validateRequest(createCategorySchema), categoryController.createCategory);

router.post('/update', validateRequest(updateCategorySchema), categoryController.updateCategory);

export default router;
