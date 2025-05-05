import { BaseService } from '@/core/abstracts/base.service';
import { IMentorMetadataRepository } from '@/core/interfaces/repositories/IMentorMetadataRepository';
import { IMentorMetadataService } from '@/core/interfaces/services/IMentorMetadataService';
import { TYPES } from '@/di/types';
import { IMentorMetadata } from '@/models/mentor-metadata.model';
import { MentorMetadataRepository } from '@/repositories/mentor-metadata.repository';
import { injectable, inject } from 'inversify';

@injectable()
export class MentorMetadataService
  extends BaseService<IMentorMetadata>
  implements IMentorMetadataService
{
  constructor(@inject(TYPES.MentorMetadataRepository) repository: IMentorMetadataRepository) {
    super(repository);
  }

  async findByType(type: string, isActive: boolean = true): Promise<IMentorMetadata[]> {
    return (this.repository as MentorMetadataRepository).findByType(type, isActive);
  }

  async create(data: Partial<IMentorMetadata>): Promise<IMentorMetadata> {
    if (!['experienceLevel', 'expertiseArea', 'technology'].includes(data.type!)) {
      throw new Error('Invalid metadata type');
    }
    return super.create(data);
  }

  async update(id: string, data: Partial<IMentorMetadata>): Promise<IMentorMetadata | null> {
    if (data.type && !['experienceLevel', 'expertiseArea', 'technology'].includes(data.type)) {
      throw new Error('Invalid metadata type');
    }
    return super.update(id, data);
  }
}
