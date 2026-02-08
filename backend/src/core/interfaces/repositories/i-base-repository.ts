import type { DeleteResult, QueryFilter, Types, UpdateQuery, UpdateWriteOpResult } from 'mongoose';

export interface IBaseRepository<T> {
  findAll: () => Promise<T[]>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: Types.ObjectId | string, data: Partial<T>) => Promise<T | null>;
  delete: (id: Types.ObjectId | string) => Promise<T | null>;
  find: (filter: QueryFilter<T>) => Promise<T[]>;
  findOne: (filter: QueryFilter<T>) => Promise<T | null>;
  findById: (id: Types.ObjectId | string) => Promise<T | null>;
  findByIdAndUpdate: (id: Types.ObjectId | string, update: UpdateQuery<T>) => Promise<T | null>;

  updateOne: (filter: QueryFilter<T>, update: UpdateQuery<T>) => Promise<UpdateWriteOpResult>;
  deleteOne: (filter: QueryFilter<T>) => Promise<DeleteResult>;

  findOneAndUpdate: (filter: QueryFilter<T>, update: UpdateQuery<T>) => Promise<T>;
  findOneAndDelete: (filter: QueryFilter<T>) => Promise<T | null>;

  softDelete: (id: Types.ObjectId | string) => Promise<T | null>;
  restore: (id: Types.ObjectId | string) => Promise<T | null>;
}
