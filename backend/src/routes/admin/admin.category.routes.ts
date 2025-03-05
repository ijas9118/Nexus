import { Router } from 'express';
import { container } from '../../di/container';
import { CategoryController } from '../../controllers/category.controller';
import { TYPES } from '../../di/types';

const categoryController = container.get<CategoryController>(TYPES.CategoryController);

const router = Router();

router.get('/', categoryController.getAllCategories);
router.post('/:id/toggle', categoryController.toggleCategory);
router.post('/', categoryController.createCategory);
router.post('/update', categoryController.updateCategory);

export default router;
