import { ICategory } from '../../../models/categories.model';

export interface ICategoryService {
  addCategory(name: string): Promise<ICategory>;
  updateCategory(id: string, newName: string): Promise<ICategory | null>;
  toggleCategory(id: string): Promise<ICategory | null>;
  getAllCategories(): Promise<ICategory[]>;
  getAllCategoriesWithPagination(
    page: number,
    limit: number,
    search: string
  ): Promise<{ categories: ICategory[]; total: number }>;
}
