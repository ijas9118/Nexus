import { BaseService } from '@/core/abstracts/base.service';
import { ITargetAudienceRepository } from '@/core/interfaces/repositories/ITargetAudienceRepository';
import { ITargetAudienceService } from '@/core/interfaces/services/ITargetAudienceService';
import { TYPES } from '@/di/types';
import { ITargetAudience } from '@/models/target-audience.model';
import CustomError from '@/utils/CustomError';
import { injectable, inject } from 'inversify';

@injectable()
export class TargetAudienceService
  extends BaseService<ITargetAudience>
  implements ITargetAudienceService
{
  constructor(@inject(TYPES.TargetAudienceRepository) repository: ITargetAudienceRepository) {
    super(repository);
  }

  async create(data: Partial<ITargetAudience>): Promise<ITargetAudience> {
    const existingAudience = await this.repository.findOne({ name: data.name });
    if (existingAudience) {
      throw new CustomError('Target audience with this name already exists');
    }
    return super.create(data);
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
    return super.update(id, data);
  }
}
