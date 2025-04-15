import { BaseRepository } from '@/core/abstracts/base.repository';
import { IMentorshipConfig } from '@/models/mentorship-config.model';

export interface IMentorshipConfigRepository extends BaseRepository<IMentorshipConfig> {
  findByCategory(category: string): Promise<IMentorshipConfig[]>;
}
