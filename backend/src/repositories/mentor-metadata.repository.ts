import { BaseRepository } from '@/core/abstracts/base.repository';
import { IMentorMetadataRepository } from '@/core/interfaces/repositories/IMentorMetadataRepository';
import { IMentorMetadata, MentorMetadataModel } from '@/models/mentor-metadata.model';
import { injectable } from 'inversify';
import { FilterQuery } from 'mongoose';

@injectable()
export class MentorMetadataRepository
  extends BaseRepository<IMentorMetadata>
  implements IMentorMetadataRepository
{
  constructor() {
    super(MentorMetadataModel);
  }

  async findByType(type: string, isActive: boolean = true): Promise<IMentorMetadata[]> {
    const filter: FilterQuery<IMentorMetadata> = { type, isActive };
    return this.model.find(filter);
  }
}
