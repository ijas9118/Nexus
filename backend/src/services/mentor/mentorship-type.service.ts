import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IMentorshipTypeService } from "@/core/interfaces/services/i-mentorship-type-service";
import type { IMentorshipType } from "@/models/mentor/mentorship-type.model";
import type { MentorshipTypeRepository } from "@/repositories/mentor/mentorship-type.repository";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { MENTOR_MESSAGES } = MESSAGES;

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
        MENTOR_MESSAGES.TYPE_EXISTS,
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
      throw new CustomError(MENTOR_MESSAGES.TYPE_NOT_FOUND, StatusCodes.NOT_FOUND);
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
      throw new CustomError(MENTOR_MESSAGES.TYPE_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
  }

  async restoreMentorshipType(id: string): Promise<void> {
    const type = await this.repository.restore(id);
    if (!type) {
      throw new CustomError(MENTOR_MESSAGES.TYPE_NOT_FOUND, StatusCodes.NOT_FOUND);
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
        MENTOR_MESSAGES.UPDATE_INACTIVE_TYPE,
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
          MENTOR_MESSAGES.TYPE_EXISTS,
          StatusCodes.BAD_REQUEST,
        );
      }
    }

    if (data.defaultPrice !== undefined && data.defaultPrice < 0) {
      throw new CustomError(MENTOR_MESSAGES.PRICE_NEGATIVE, StatusCodes.BAD_REQUEST);
    }

    const updatedType = await this.repository.update(id, data);
    if (!updatedType) {
      throw new CustomError(MENTOR_MESSAGES.TYPE_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    return updatedType;
  }
}
