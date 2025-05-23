import { Request, Response } from 'express';
import { ICategoryController } from '../core/interfaces/controllers/ICategoryController';
import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import { ICategoryService } from '../core/interfaces/services/ICategoryService';
import asyncHandler from 'express-async-handler';
import CustomError from '../utils/CustomError';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class CategoryController implements ICategoryController {
  constructor(@inject(TYPES.CategoryService) private categoryService: ICategoryService) {}

  // Create a new category
  createCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body;

    if (!name) {
      throw new CustomError('Category name is required', StatusCodes.BAD_REQUEST);
    }

    const category = await this.categoryService.addCategory(name);
    res.status(StatusCodes.CREATED).json(category);
  });

  // Update a category by ID and new name
  updateCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id, newName } = req.body;

    if (!id || !newName) {
      throw new CustomError('Category ID and new name are required', StatusCodes.BAD_REQUEST);
    }

    const updatedCategory = await this.categoryService.updateCategory(id, newName);

    if (!updatedCategory) {
      throw new CustomError('Category not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json(updatedCategory);
  });

  // Toggle a category by ID
  toggleCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      throw new CustomError('Category ID is required', StatusCodes.BAD_REQUEST);
    }

    const toggledCategory = await this.categoryService.toggleCategory(id);

    if (!toggledCategory) {
      throw new CustomError('Category not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json(toggledCategory);
  });

  // Get all categories
  getAllCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userRole = req.user?.role || 'user';

    if (userRole === 'admin') {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || '';

      const { categories, total } = await this.categoryService.getAllCategoriesWithPagination(
        page,
        limit,
        search
      );

      if (!categories || categories.length === 0) {
        throw new CustomError('No categories found', StatusCodes.NOT_FOUND);
      }

      res.status(StatusCodes.OK).json({
        categories,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } else {
      const categories = await this.categoryService.getAllCategories();

      if (!categories || categories.length === 0) {
        throw new CustomError('No categories found', StatusCodes.NOT_FOUND);
      }

      res.status(StatusCodes.OK).json(categories);
    }
  });
}
