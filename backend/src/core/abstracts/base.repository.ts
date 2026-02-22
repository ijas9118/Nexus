import type {
  DeleteResult,
  Document,
  Model,
  QueryFilter,
  Types,
  UpdateQuery,
  UpdateWriteOpResult,
} from "mongoose";

import type { IBaseRepository } from "../interfaces/repositories/i-base-repository";

export abstract class BaseRepository<T extends Document<string>> implements IBaseRepository<T> {
  constructor(protected _model: Model<T>) {}

  async findById(id: Types.ObjectId | string): Promise<T | null> {
    return this._model.findById(id);
  }

  async findByIdAndUpdate(id: Types.ObjectId | string, update: UpdateQuery<T>): Promise<T | null> {
    return this._model.findByIdAndUpdate(id, update, { upsert: true, new: true });
  }

  async findAll(): Promise<T[]> {
    return this._model.find();
  }

  async create(data: Partial<T>): Promise<T> {
    return this._model.create(data);
  }

  async update(id: Types.ObjectId | string, data: Partial<T>): Promise<T | null> {
    return this._model.findByIdAndUpdate(id, data, { new: true });
  }

  async updateOne(filter: QueryFilter<T>, update: UpdateQuery<T>): Promise<UpdateWriteOpResult> {
    return this._model.updateOne(filter, update);
  }

  async delete(id: Types.ObjectId | string): Promise<T | null> {
    return this._model.findByIdAndDelete(id);
  }

  async deleteOne(filter: QueryFilter<T>): Promise<DeleteResult> {
    return this._model.deleteOne(filter);
  }

  async find(filter: QueryFilter<T>): Promise<T[]> {
    return await this._model.find(filter);
  }

  async findOne(filter: QueryFilter<T>): Promise<T | null> {
    return this._model.findOne(filter);
  }

  async findOneAndUpdate(filter: QueryFilter<T>, update: UpdateQuery<T>): Promise<T> {
    return this._model.findOneAndUpdate(filter, update, { upsert: true, new: true });
  }

  async findOneAndDelete(filter: QueryFilter<T>): Promise<T | null> {
    return this._model.findOneAndDelete(filter);
  }

  async softDelete(id: Types.ObjectId | string): Promise<T | null> {
    return this._model.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  async restore(id: Types.ObjectId | string): Promise<T | null> {
    return this._model.findByIdAndUpdate(id, { isActive: true }, { new: true });
  }
}
