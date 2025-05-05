import { BaseRepository } from '@/core/abstracts/base.repository';
import { IMentorMetadata } from '@/models/mentor-metadata.model';

export interface IMentorMetadataRepository extends BaseRepository<IMentorMetadata> {
  findByType(type: string, isActive: boolean): Promise<IMentorMetadata[]>;
}
