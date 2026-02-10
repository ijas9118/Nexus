import type { BaseRepository } from "@/core/abstracts/base.repository";
import type { IMentorMetadata } from "@/models/mentor/mentor-metadata.model";

export interface IMentorMetadataRepository extends BaseRepository<IMentorMetadata> {
  findByType: (type: string, isActive: boolean) => Promise<IMentorMetadata[]>;
}
