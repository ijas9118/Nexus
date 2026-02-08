import type { FilterQuery } from "mongoose";

import type { IMentorMetadata } from "@/models/mentor-metadata.model";

export interface IMentorMetadataService {
  create: (data: Partial<IMentorMetadata>) => Promise<IMentorMetadata>;
  update: (id: string, data: Partial<IMentorMetadata>) => Promise<IMentorMetadata | null>;
  findById: (id: string) => Promise<IMentorMetadata | null>;
  find: (query: FilterQuery<IMentorMetadata>) => Promise<IMentorMetadata[]>;
  findByType: (type: string, isActive: boolean) => Promise<IMentorMetadata[]>;
  softDelete: (id: string) => Promise<IMentorMetadata | null>;
  restore: (id: string) => Promise<IMentorMetadata | null>;
}
