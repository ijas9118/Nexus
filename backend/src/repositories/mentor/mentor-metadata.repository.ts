import { injectable } from "inversify";

import type { IMentorMetadataRepository } from "@/core/interfaces/repositories/i-mentor-metadata-repository";
import type { IMentorMetadata } from "@/models/mentor/mentor-metadata.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { MentorMetadataModel } from "@/models/mentor/mentor-metadata.model";

@injectable()
export class MentorMetadataRepository
  extends BaseRepository<IMentorMetadata>
  implements IMentorMetadataRepository {
  constructor() {
    super(MentorMetadataModel);
  }

  async findByType(type: string, isActive: boolean = true): Promise<IMentorMetadata[]> {
    return this._model.find({ type, isActive });
  }
}
