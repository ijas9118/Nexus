import type { QueryFilter } from "mongoose";

import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { ITargetAudienceRepository } from "@/core/interfaces/repositories/i-target-audience-repository";
import type { ITargetAudienceService } from "@/core/interfaces/services/i-target-audience-service";
import type { ITargetAudience } from "@/models/content/target-audience.model";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { MENTOR_MESSAGES } = MESSAGES;

@injectable()
export class TargetAudienceService implements ITargetAudienceService {
  constructor(
    @inject(TYPES.TargetAudienceRepository) private _repository: ITargetAudienceRepository,
  ) {}

  async create(data: Partial<ITargetAudience>): Promise<ITargetAudience> {
    const existingAudience = await this._repository.findOne({ name: data.name });
    if (existingAudience) {
      throw new CustomError(MENTOR_MESSAGES.AUDIENCE_EXISTS, StatusCodes.CONFLICT);
    }
    return this._repository.create(data);
  }

  async update(id: string, data: Partial<ITargetAudience>): Promise<ITargetAudience | null> {
    if (data.name) {
      const existingAudience = await this._repository.findOne({
        name: data.name,
        _id: { $ne: id },
      });
      if (existingAudience) {
        throw new CustomError(MENTOR_MESSAGES.AUDIENCE_EXISTS, StatusCodes.CONFLICT);
      }
    }
    return this._repository.update(id, data);
  }

  async find(query: QueryFilter<ITargetAudience> = {}): Promise<ITargetAudience[]> {
    return this._repository.find(query);
  }

  async findById(id: string): Promise<ITargetAudience | null> {
    return this._repository.findById(id);
  }

  async softDelete(id: string): Promise<ITargetAudience | null> {
    return this._repository.softDelete(id);
  }

  async restore(id: string): Promise<ITargetAudience | null> {
    return this._repository.restore(id);
  }
}
