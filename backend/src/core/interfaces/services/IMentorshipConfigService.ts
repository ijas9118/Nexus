import { IMentorshipConfig } from '@/models/mentorship-config.model';

export interface IMentorshipConfigService {
  createConfig(config: Partial<IMentorshipConfig>): Promise<IMentorshipConfig>;
  getConfigsByCategory(category: string): Promise<IMentorshipConfig[]>;
  getAllConfigs(): Promise<IMentorshipConfig[]>;
  getConfigById(id: string): Promise<IMentorshipConfig>;
  updateConfig(id: string, config: Partial<IMentorshipConfig>): Promise<IMentorshipConfig>;
  deleteConfig(id: string): Promise<void>;
}
