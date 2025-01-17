import { Document, FilterQuery } from "mongoose";
import { BaseRepository } from "./base.repository";

export abstract class BaseService<T extends Document> {
  constructor(protected repository: BaseRepository<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  async findOne(conditions: FilterQuery<T>): Promise<T | null> {
    return this.repository.findOne(conditions);
  }

  async find(conditions: FilterQuery<T>): Promise<T[]> {
    return this.repository.find(conditions);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<T | null> {
    return this.repository.delete(id);
  }
}
