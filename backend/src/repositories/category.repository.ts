import { Types } from 'mongoose';
import { BaseRepository } from '../core/abstracts/base.repository';
import { ICategoryRepository } from '../core/interfaces/repositories/ICategoryRepository';
import { CategoryModel, ICategory } from '../models/categories.model';
import { injectable } from 'inversify';

@injectable()
export class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepository {
  constructor() {
    super(CategoryModel);
  }

  async addCategory(name: string): Promise<ICategory> {
    return await this.create({ name });
  }

  async updateCategory(id: string, newName: string): Promise<ICategory | null> {
    const objId = new Types.ObjectId(id);
    return await this.update(objId, { name: newName });
  }

  async toggleCategory(id: string): Promise<ICategory | null> {
    const objId = new Types.ObjectId(id);

    const category = await this.findById(objId);
    if (!category) {
      return null;
    }

    return await this.update(objId, { isActive: !category.isActive });
  }

  async findAllWithPagination(
    page: number,
    limit: number,
    search: string
  ): Promise<{ categories: ICategory[]; total: number }> {
    const skip = (page - 1) * limit;
    const query = search
      ? { name: { $regex: search, $options: 'i' } } // Case-insensitive search
      : {};

    const [categories, total] = await Promise.all([
      this.model.find(query).skip(skip).limit(limit).exec(),
      this.model.countDocuments(query).exec(),
    ]);

    return { categories, total };
  }
}
