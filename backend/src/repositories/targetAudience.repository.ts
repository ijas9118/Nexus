import { BaseRepository } from '@/core/abstracts/base.repository';
import { ITargetAudienceRepository } from '@/core/interfaces/repositories/ITargetAudienceRepository';
import { ITargetAudience, TargetAudienceModel } from '@/models/target-audience.model';
import { injectable } from 'inversify';

@injectable()
export class TargetAudienceRepository
  extends BaseRepository<ITargetAudience>
  implements ITargetAudienceRepository
{
  constructor() {
    super(TargetAudienceModel);
  }
}
