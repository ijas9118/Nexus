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
  constructor(@inject(TYPES.CategoryRepository) private _categoryRepository: ICategoryRepository) {}

  async addCategory(name: string): Promise<ICategory> {
    const normalizedName = this.normalizeCategoryName(name);

    const existingCategory = await this.findByNameCaseInsensitive(normalizedName);

    if (existingCategory) {
      throw new CustomError(CATEGORY_MESSAGES.EXISTS, StatusCodes.CONFLICT);
    }

    return await this._categoryRepository.addCategory(normalizedName);
  }

  async updateCategory(id: string, newName: string): Promise<ICategory | null> {
    const normalizedNewName = this.normalizeCategoryName(newName);

    const existingCategory = await this.findByNameCaseInsensitive(normalizedNewName);

    if (existingCategory && existingCategory._id.toString() !== id) {
      throw new CustomError(CATEGORY_MESSAGES.EXISTS, StatusCodes.CONFLICT);
    }
    return await this._categoryRepository.updateCategory(id, normalizedNewName);
  }

  async toggleCategory(id: string): Promise<ICategory | null> {
    return await this._categoryRepository.toggleCategory(id);
  }

  async getAllCategories(): Promise<ICategory[]> {
    return await this._categoryRepository.getAllCategories();
  }

  async getAllCategoriesWithPagination(
    page: number,
    limit: number,
    search: string,
  ): Promise<{ categories: ICategory[]; total: number }> {
    return await this._categoryRepository.findAllWithPagination(page, limit, search);
  }

  private normalizeCategoryName(name: string): string {
    const normalizedName = name.trim();
    if (!normalizedName) {
      throw new CustomError(CATEGORY_MESSAGES.NAME_REQUIRED, StatusCodes.BAD_REQUEST);
    }
    return normalizedName;
  }

  private async findByNameCaseInsensitive(name: string): Promise<ICategory | null> {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return await this._categoryRepository.findOne({
      name: { $regex: `^${escapedName}$`, $options: "i" },
    });
  }
}
