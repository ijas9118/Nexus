import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IMentorshipTypeService } from "@/core/interfaces/services/i-mentorship-type-service";
import type { IMentorshipType } from "@/models/mentor/mentorship-type.model";
import type { MentorshipTypeRepository } from "@/repositories/mentor/mentorship-type.repository";

import { TYPES } from "@/di/types";
import CustomError from "@/utils/custom-error";

@injectable()
export class MentorshipTypeService implements IMentorshipTypeService {
  constructor(
    @inject(TYPES.MentorshipTypeRepository) protected repository: MentorshipTypeRepository,
  ) {}

  async createMentorshipType(data: {
    name: string;
    description: string;
    defaultPrice?: number;
  }): Promise<IMentorshipType> {
    const existingType = await this.repository.findOne({ name: data.name });
    if (existingType) {
      throw new CustomError(
        "Mentorship type with this name already exists",
        StatusCodes.BAD_REQUEST,
      );
    }

    return this.repository.create({
      name: data.name,
      description: data.description,
      defaultPrice: data.defaultPrice,
    });
  }

  async getMentorshipType(id: string): Promise<IMentorshipType> {
    const type = await this.repository.findById(id);
    if (!type || !type.isActive) {
      throw new CustomError("Mentorship type not found", StatusCodes.NOT_FOUND);
    }
    return type;
  }

  async getAllMentorshipTypes(options?: { includeInactive?: boolean }): Promise<IMentorshipType[]> {
    if (options?.includeInactive) {
      return this.repository.find({});
    }
    return this.repository.find({ isActive: true });
  }

  async deleteMentorshipType(id: string): Promise<void> {
    const type = await this.repository.softDelete(id);
    if (!type) {
      throw new CustomError("Mentorship type not found", StatusCodes.NOT_FOUND);
    }
  }

  async restoreMentorshipType(id: string): Promise<void> {
    const type = await this.repository.restore(id);
    if (!type) {
      throw new CustomError("Mentorship type not found", StatusCodes.NOT_FOUND);
    }
  }

  async updateMentorshipType(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      defaultPrice: number;
    }>,
  ): Promise<IMentorshipType> {
    const typeToUpdate = await this.repository.findById(id);

    if (!typeToUpdate || !typeToUpdate.isActive) {
      throw new CustomError(
        "Cannot update inactive or non-existent mentorship type",
        StatusCodes.NOT_FOUND,
      );
    }

    if (data.name) {
      const existingType = await this.repository.findOne({
        name: data.name,
        _id: { $ne: id },
      });
      if (existingType) {
        throw new CustomError(
          "Mentorship type with this name already exists",
          StatusCodes.BAD_REQUEST,
        );
      }
    }

    if (data.defaultPrice !== undefined && data.defaultPrice < 0) {
      throw new CustomError("Price cannot be negative", StatusCodes.BAD_REQUEST);
    }

    const updatedType = await this.repository.update(id, data);
    if (!updatedType) {
      throw new CustomError("Mentorship type not found", StatusCodes.NOT_FOUND);
    }

    return updatedType;
  }
}
