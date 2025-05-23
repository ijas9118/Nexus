import { IMentorMetadataRepository } from '@/core/interfaces/repositories/IMentorMetadataRepository';
import { IMentorMetadataService } from '@/core/interfaces/services/IMentorMetadataService';
import { TYPES } from '@/di/types';
import { IMentorMetadata } from '@/models/mentor-metadata.model';
import { MentorMetadataRepository } from '@/repositories/mentor-metadata.repository';
import { injectable, inject } from 'inversify';
import { FilterQuery } from 'mongoose';

@injectable()
export class MentorMetadataService implements IMentorMetadataService {
  constructor(
    @inject(TYPES.MentorMetadataRepository) private repository: IMentorMetadataRepository
  ) {}

  async findByType(type: string, isActive: boolean = true): Promise<IMentorMetadata[]> {
    return (this.repository as MentorMetadataRepository).findByType(type, isActive);
  }

  async create(data: Partial<IMentorMetadata>): Promise<IMentorMetadata> {
    if (!['experienceLevel', 'expertiseArea', 'technology'].includes(data.type!)) {
      throw new Error('Invalid metadata type');
    }
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<IMentorMetadata>): Promise<IMentorMetadata | null> {
    if (data.type && !['experienceLevel', 'expertiseArea', 'technology'].includes(data.type)) {
      throw new Error('Invalid metadata type');
    }
    return this.repository.update(id, data);
  }

  async findById(id: string): Promise<IMentorMetadata | null> {
    return this.repository.findById(id);
  }

  async find(query: FilterQuery<IMentorMetadata> = {}): Promise<IMentorMetadata[]> {
    console.log(query);

    return this.repository.find(query);
  }

  async softDelete(id: string): Promise<IMentorMetadata | null> {
    return this.repository.softDelete(id);
  }

  async restore(id: string): Promise<IMentorMetadata | null> {
    return this.repository.restore(id);
  }
}
