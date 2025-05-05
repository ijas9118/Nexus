import { Document, FilterQuery, Types } from 'mongoose';

export interface IBaseService<T extends Document> {
  create(data: Partial<T>): Promise<T>;
  findById(id: Types.ObjectId | string): Promise<T | null>;
  findOne(conditions: FilterQuery<T>): Promise<T | null>;
  find(conditions: FilterQuery<T>): Promise<T[]>;
  update(id: Types.ObjectId | string, data: Partial<T>): Promise<T | null>;
  delete(id: Types.ObjectId | string): Promise<T | null>;
  softDelete(id: Types.ObjectId | string): Promise<T | null>;
  restore(id: Types.ObjectId | string): Promise<T | null>;
}
