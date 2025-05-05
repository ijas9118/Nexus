import { IMentorMetadata } from '@/models/mentor-metadata.model';
import { IBaseService } from './IBaseService';

export interface IMentorMetadataService extends IBaseService<IMentorMetadata> {
  findByType(type: string, isActive: boolean): Promise<IMentorMetadata[]>;
  create(data: Partial<IMentorMetadata>): Promise<IMentorMetadata>;
  update(id: string, data: Partial<IMentorMetadata>): Promise<IMentorMetadata | null>;
}
