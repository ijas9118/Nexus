import { injectable } from 'inversify';

import type { IMentorshipType } from '@/models/mentorship-type.model';

import { BaseRepository } from '@/core/abstracts/base.repository';
import { MentorshipTypeModel } from '@/models/mentorship-type.model';

@injectable()
export class MentorshipTypeRepository extends BaseRepository<IMentorshipType> {
  constructor() {
    super(MentorshipTypeModel);
  }
}
