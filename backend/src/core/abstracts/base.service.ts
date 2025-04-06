import { Document, FilterQuery, Types } from 'mongoose';
import { IBaseRepository } from '../interfaces/repositories/IBaseRepository';

export abstract class BaseService<T extends Document> {
  constructor(protected repository: IBaseRepository<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async findById(id: Types.ObjectId): Promise<T | null> {
    return this.repository.findById(id);
  }

  async findOne(conditions: FilterQuery<T>): Promise<T | null> {
    return this.repository.findOne(conditions);
  }

  async find(conditions: FilterQuery<T>): Promise<T[]> {
    return this.repository.find(conditions);
  }

  async update(id: Types.ObjectId, data: Partial<T>): Promise<T | null> {
    return this.repository.update(id, data);
  }

  async delete(id: Types.ObjectId): Promise<T | null> {
    return this.repository.delete(id);
  }
}
