import { inject, injectable } from "inversify";
import { BaseService } from "../core/abstracts/base.service";
import { ICategoryService } from "../core/interfaces/services/ICategoryService";
import { ICategory } from "../models/categories.model";
import { CategoryRepository } from "../repositories/category.repository";
import { TYPES } from "../di/types";

@injectable()
export class CategoryService extends BaseService<ICategory> implements ICategoryService {
  constructor(
    @inject(TYPES.CategoryRepository) private categoryRepository: CategoryRepository
  ) {
    super(categoryRepository);
  }
  async addCategory(name: string): Promise<ICategory> {
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
}
