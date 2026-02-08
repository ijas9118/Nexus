import { injectable } from 'inversify';

import type { ITargetAudienceRepository } from '@/core/interfaces/repositories/i-target-audience-repository';
import type { ITargetAudience } from '@/models/target-audience.model';

import { BaseRepository } from '@/core/abstracts/base.repository';
import { TargetAudienceModel } from '@/models/target-audience.model';

@injectable()
export class TargetAudienceRepository
  extends BaseRepository<ITargetAudience>
  implements ITargetAudienceRepository
{
  constructor() {
    super(TargetAudienceModel);
  }
}
