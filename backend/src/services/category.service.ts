import { inject, injectable } from 'inversify';
import { ICategoryService } from '../core/interfaces/services/ICategoryService';
import { ICategory } from '../models/categories.model';
import { TYPES } from '../di/types';
import { ICategoryRepository } from '../core/interfaces/repositories/ICategoryRepository';
import CustomError from '@/utils/CustomError';

@injectable()
export class CategoryService implements ICategoryService {
  constructor(@inject(TYPES.CategoryRepository) private categoryRepository: ICategoryRepository) {}

  async addCategory(name: string): Promise<ICategory> {
    const existingCategory = await this.categoryRepository.findOne({ name });

    if (existingCategory) {
      throw new CustomError('Category already exists', 409);
    }

    return await this.categoryRepository.addCategory(name);
  }

  async updateCategory(id: string, newName: string): Promise<ICategory | null> {
    return await this.categoryRepository.updateCategory(id, newName);
  }

  async toggleCategory(id: string): Promise<ICategory | null> {
    return await this.categoryRepository.toggleCategory(id);
  }

  async getAllCategories(): Promise<ICategory[]> {
    return await this.categoryRepository.findAll();
  }

  async getAllCategoriesWithPagination(
    page: number,
    limit: number,
    search: string
  ): Promise<{ categories: ICategory[]; total: number }> {
    return await this.categoryRepository.findAllWithPagination(page, limit, search);
  }
}
