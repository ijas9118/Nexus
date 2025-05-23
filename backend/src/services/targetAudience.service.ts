import { ITargetAudienceRepository } from '@/core/interfaces/repositories/ITargetAudienceRepository';
import { ITargetAudienceService } from '@/core/interfaces/services/ITargetAudienceService';
import { TYPES } from '@/di/types';
import { ITargetAudience } from '@/models/target-audience.model';
import CustomError from '@/utils/CustomError';
import { injectable, inject } from 'inversify';

@injectable()
export class TargetAudienceService implements ITargetAudienceService {
  constructor(
    @inject(TYPES.TargetAudienceRepository) private repository: ITargetAudienceRepository
  ) {}

  async create(data: Partial<ITargetAudience>): Promise<ITargetAudience> {
    const existingAudience = await this.repository.findOne({ name: data.name });
    if (existingAudience) {
      throw new CustomError('Target audience with this name already exists');
    }
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<ITargetAudience>): Promise<ITargetAudience | null> {
    if (data.name) {
      const existingAudience = await this.repository.findOne({
        name: data.name,
        _id: { $ne: id },
      });
      if (existingAudience) {
        throw new CustomError('Target audience with this name already exists');
      }
    }
    return this.repository.update(id, data);
  }

  async find(query: Partial<ITargetAudience> = {}): Promise<ITargetAudience[]> {
    return this.repository.find({ query });
  }

  async findById(id: string): Promise<ITargetAudience | null> {
    return this.repository.findById(id);
  }

  async softDelete(id: string): Promise<ITargetAudience | null> {
    return this.repository.softDelete(id);
  }

  async restore(id: string): Promise<ITargetAudience | null> {
    return this.repository.restore(id);
  }
}
