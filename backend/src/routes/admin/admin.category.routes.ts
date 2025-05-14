import { ICategoryController } from '@/core/interfaces/controllers/ICategoryController';
import { container } from '@/di/container';
import { TYPES } from '@/di/types';
import { Router } from 'express';

const categoryController = container.get<ICategoryController>(TYPES.CategoryController);
const router = Router();

router.get('/', categoryController.getAllCategories);

router.post('/:id/toggle', categoryController.toggleCategory);

router.post('/', categoryController.createCategory);

router.post('/update', categoryController.updateCategory);

export default router;
