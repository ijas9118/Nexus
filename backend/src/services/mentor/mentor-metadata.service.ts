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
    if (!data.type || !data.name || !data.label) {
      throw new CustomError(MENTOR_MESSAGES.MISSING_FIELDS, StatusCodes.BAD_REQUEST);
    }

    const nameTrimmed = data.name.trim();
    const labelTrimmed = data.label.trim();
    const escapedName = nameTrimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const escapedLabel = labelTrimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const existingMetadata = await this._repository.findOne({
      type: data.type,
      $or: [
        { name: { $regex: new RegExp(`^${escapedName}$`, "i") } },
        { label: { $regex: new RegExp(`^${escapedLabel}$`, "i") } },
      ],
    });

    if (existingMetadata) {
      throw new CustomError(
        "Metadata with this name or label already exists for this type",
        StatusCodes.BAD_REQUEST,
      );
    }

    data.name = nameTrimmed;
    data.label = labelTrimmed;

    return this._repository.create(data);
  }

  async update(id: string, data: Partial<IMentorMetadata>): Promise<IMentorMetadata | null> {
    const existingRecord = await this._repository.findById(id);
    if (!existingRecord) {
      throw new CustomError(MENTOR_MESSAGES.META_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const type = data.type || existingRecord.type;
    const name = data.name ? data.name.trim() : existingRecord.name;
    const label = data.label ? data.label.trim() : existingRecord.label;

    if (data.name || data.label || data.type) {
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const duplicateCheck = await this._repository.findOne({
        type,
        _id: { $ne: id },
        $or: [
          { name: { $regex: new RegExp(`^${escapedName}$`, "i") } },
          { label: { $regex: new RegExp(`^${escapedLabel}$`, "i") } },
        ],
      });

      if (duplicateCheck) {
        throw new CustomError(
          "Metadata with this name or label already exists for this type",
          StatusCodes.BAD_REQUEST,
        );
      }
    }

    if (data.name)
      data.name = name;
    if (data.label)
      data.label = label;

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
