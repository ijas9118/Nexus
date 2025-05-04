import { BaseService } from '@/core/abstracts/base.service';
import { IMentorshipTypeService } from '@/core/interfaces/services/IMentorshipTypeService';
import { TYPES } from '@/di/types';
import { IMentorshipType } from '@/models/mentorship-type.model';
import { MentorshipTypeRepository } from '@/repositories/mentorship-type.repository';
import CustomError from '@/utils/CustomError';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

@injectable()
export class MentorshipTypeService
  extends BaseService<IMentorshipType>
  implements IMentorshipTypeService
{
  constructor(
    @inject(TYPES.MentorshipTypeRepository) protected repository: MentorshipTypeRepository
  ) {
    super(repository);
  }

  async createMentorshipType(data: {
    name: string;
    description: string;
  }): Promise<IMentorshipType> {
    const existingType = await this.findOne({ name: data.name });
    if (existingType) {
      throw new CustomError(
        'Mentorship type with this name already exists',
        StatusCodes.BAD_REQUEST
      );
    }

    return this.create({
      name: data.name,
      description: data.description,
    });
  }

  async getMentorshipType(id: string): Promise<IMentorshipType> {
    const type = await this.findById(id);
    if (!type || !type.isActive) {
      throw new CustomError('Mentorship type not found', StatusCodes.NOT_FOUND);
    }
    return type;
  }

  async getAllMentorshipTypes(): Promise<IMentorshipType[]> {
    return this.find({ isActive: true });
  }

  async updateMentorshipType(
    id: string,
    data: Partial<{
      name: string;
      description: string;
    }>
  ): Promise<IMentorshipType> {
    if (data.name) {
      const existingType = await this.repository.findOne({
        name: data.name,
        _id: { $ne: id },
      });
      if (existingType) {
        throw new CustomError(
          'Mentorship type with this name already exists',
          StatusCodes.BAD_REQUEST
        );
      }
    }

    const updatedType = await this.update(id, data);
    if (!updatedType || !updatedType.isActive) {
      throw new CustomError('Mentorship type not found', StatusCodes.NOT_FOUND);
    }
    return updatedType;
  }

  async deleteMentorshipType(id: string): Promise<void> {
    const type = await this.softDelete(id);
    if (!type) {
      throw new CustomError('Mentorship type not found', StatusCodes.NOT_FOUND);
    }
  }
}
