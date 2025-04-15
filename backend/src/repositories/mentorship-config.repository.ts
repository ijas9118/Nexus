import { BaseRepository } from '@/core/abstracts/base.repository';
import { IMentorshipConfigRepository } from '@/core/interfaces/repositories/IMentorshipConfigRepository';
import { IMentorshipConfig, MentorshipConfigModel } from '@/models/mentorship-config.model';
import { injectable } from 'inversify';

@injectable()
export class MentorshipConfigRepository
  extends BaseRepository<IMentorshipConfig>
  implements IMentorshipConfigRepository
{
  constructor() {
    super(MentorshipConfigModel);
  }

  findByCategory = async (category: string): Promise<IMentorshipConfig[]> => {
    return await this.find({ category, isActive: true });
  };
}
