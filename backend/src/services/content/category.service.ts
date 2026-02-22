import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { ICategoryRepository } from "@/core/interfaces/repositories/i-category-repository";
import type { ICategoryService } from "@/core/interfaces/services/i-category-service";
import type { ICategory } from "@/models/content/categories.model";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { CATEGORY_MESSAGES } = MESSAGES;

@injectable()
export class CategoryService implements ICategoryService {
  constructor(@inject(TYPES.CategoryRepository) private categoryRepository: ICategoryRepository) {}

  async addCategory(name: string): Promise<ICategory> {
    const existingCategory = await this.categoryRepository.findOne({ name });

    if (existingCategory) {
      throw new CustomError(CATEGORY_MESSAGES.EXISTS, StatusCodes.CONFLICT);
    }

    return await this.categoryRepository.addCategory(name);
  }

  async updateCategory(id: string, newName: string): Promise<ICategory | null> {
    const existingCategory = await this.categoryRepository.findOne({ name: newName });

    if (existingCategory) {
      throw new CustomError(CATEGORY_MESSAGES.EXISTS, StatusCodes.CONFLICT);
    }
    return await this.categoryRepository.updateCategory(id, newName);
  }

  async toggleCategory(id: string): Promise<ICategory | null> {
    return await this.categoryRepository.toggleCategory(id);
  }

  async getAllCategories(): Promise<ICategory[]> {
    return await this.categoryRepository.getAllCategories();
  }

  async getAllCategoriesWithPagination(
    page: number,
    limit: number,
    search: string,
  ): Promise<{ categories: ICategory[]; total: number }> {
    return await this.categoryRepository.findAllWithPagination(page, limit, search);
  }
}
