import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IMentorshipTypeService } from "@/core/interfaces/services/i-mentorship-type-service";
import type { MentorshipTypeRepository } from "@/repositories/mentor/mentorship-type.repository";

import { TYPES } from "@/di/types";
import { MentorshipTypeResponseDto } from "@/dtos/responses/mentorship-type.dto";
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
  }): Promise<MentorshipTypeResponseDto> {
    const existingType = await this.repository.findOne({ name: data.name });
    if (existingType) {
      throw new CustomError(
        MENTOR_MESSAGES.TYPE_EXISTS,
        StatusCodes.BAD_REQUEST,
      );
    }

    const created = await this.repository.create({
      name: data.name,
      description: data.description,
      defaultPrice: data.defaultPrice,
    });

    return MentorshipTypeResponseDto.fromEntity(created);
  }

  async getMentorshipType(id: string): Promise<MentorshipTypeResponseDto> {
    const type = await this.repository.findById(id);
    if (!type || !type.isActive) {
      throw new CustomError(MENTOR_MESSAGES.TYPE_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    return MentorshipTypeResponseDto.fromEntity(type);
  }

  async getAllMentorshipTypes(options?: { includeInactive?: boolean }): Promise<MentorshipTypeResponseDto[]> {
    const mentorshipTypes = options?.includeInactive
      ? await this.repository.find({})
      : await this.repository.find({ isActive: true });

    return MentorshipTypeResponseDto.fromEntities(mentorshipTypes);
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
  ): Promise<MentorshipTypeResponseDto> {
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

    return MentorshipTypeResponseDto.fromEntity(updatedType);
  }
}
