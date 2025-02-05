import { ICategory } from "../../../models/categories.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface ICategoryRepository extends BaseRepository<ICategory> {
  addCategory(name: string): Promise<ICategory>;
  updateCategory(id: string, newName: string): Promise<ICategory | null>;
  toggleCategory(id: string): Promise<ICategory | null>;
}
