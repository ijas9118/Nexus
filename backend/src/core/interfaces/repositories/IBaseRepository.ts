import { FilterQuery, Types } from "mongoose";

export interface IBaseRepository<T> {
  findAll(): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: Types.ObjectId, data: Partial<T>): Promise<T | null>;
  delete(id: Types.ObjectId): Promise<T | null>;
  find(filter: FilterQuery<T>): Promise<T[]>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
}
