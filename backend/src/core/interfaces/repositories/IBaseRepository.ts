import { DeleteResult, FilterQuery, Types, UpdateQuery, UpdateWriteOpResult } from 'mongoose';

export interface IBaseRepository<T> {
  findAll(): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: Types.ObjectId, data: Partial<T>): Promise<T | null>;
  delete(id: Types.ObjectId): Promise<T | null>;
  find(filter: FilterQuery<T>): Promise<T[]>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  findById(id: Types.ObjectId): Promise<T | null>;
  findByIdAndUpdate(id: Types.ObjectId, update: UpdateQuery<T>): Promise<T | null>;

  updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<UpdateWriteOpResult>;
  deleteOne(filter: FilterQuery<T>): Promise<DeleteResult>;

  findOneAndUpdate(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T>;
  findOneAndDelete(filter: FilterQuery<T>): Promise<T | null>;
}
