import type { QueryFilter } from "mongoose";

import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IMentorMetadataRepository } from "@/core/interfaces/repositories/i-mentor-metadata-repository";
import type { IMentorMetadataService } from "@/core/interfaces/services/i-mentor-metadata-service";
import type { IMentorMetadata } from "@/models/mentor/mentor-metadata.model";
import type { MentorMetadataRepository } from "@/repositories/mentor/mentor-metadata.repository";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { MENTOR_MESSAGES } = MESSAGES;

@injectable()
export class MentorMetadataService implements IMentorMetadataService {
  constructor(
    @inject(TYPES.MentorMetadataRepository) private _repository: IMentorMetadataRepository,
  ) {}

  async findByType(type: string, isActive: boolean = true): Promise<IMentorMetadata[]> {
    return (this._repository as MentorMetadataRepository).findByType(type, isActive);
  }

  async create(data: Partial<IMentorMetadata>): Promise<IMentorMetadata> {
    if (!["experienceLevel", "expertiseArea", "technology"].includes(data.type!)) {
      throw new CustomError(MENTOR_MESSAGES.INVALID_META_TYPE, StatusCodes.BAD_REQUEST);
    }
    return this._repository.create(data);
  }

  async update(id: string, data: Partial<IMentorMetadata>): Promise<IMentorMetadata | null> {
    if (data.type && !["experienceLevel", "expertiseArea", "technology"].includes(data.type)) {
      throw new CustomError(MENTOR_MESSAGES.INVALID_META_TYPE, StatusCodes.BAD_REQUEST);
    }
    return this._repository.update(id, data);
  }

  async findById(id: string): Promise<IMentorMetadata | null> {
    return this._repository.findById(id);
  }

  async find(query: QueryFilter<IMentorMetadata> = {}): Promise<IMentorMetadata[]> {
    return this._repository.find(query);
  }

  async softDelete(id: string): Promise<IMentorMetadata | null> {
    return this._repository.softDelete(id);
  }

  async restore(id: string): Promise<IMentorMetadata | null> {
    return this._repository.restore(id);
  }
}
