import { injectable } from 'inversify';
import { IMentorshipType, MentorshipTypeModel } from '@/models/mentorship-type.model';
import { BaseRepository } from '@/core/abstracts/base.repository';

@injectable()
export class MentorshipTypeRepository extends BaseRepository<IMentorshipType> {
  constructor() {
    super(MentorshipTypeModel);
  }
}
