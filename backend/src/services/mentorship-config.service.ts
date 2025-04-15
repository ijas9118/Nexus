import { BaseService } from '@/core/abstracts/base.service';
import { IMentorshipConfigRepository } from '@/core/interfaces/repositories/IMentorshipConfigRepository';
import { IMentorshipConfigService } from '@/core/interfaces/services/IMentorshipConfigService';
import { TYPES } from '@/di/types';
import { IMentorshipConfig } from '@/models/mentorship-config.model';
import { inject, injectable } from 'inversify';

@injectable()
export class MentorshipConfigService
  extends BaseService<IMentorshipConfig>
  implements IMentorshipConfigService
{
  constructor(
    @inject(TYPES.MentorshipConfigRepository) private configRepository: IMentorshipConfigRepository
  ) {
    super(configRepository);
  }

  createConfig = async (config: Partial<IMentorshipConfig>): Promise<IMentorshipConfig> => {
    if (!config.category || !config.value) {
      throw new Error('Category and value are required');
    }
    // Ensure value is unique per category
    const existing = await this.configRepository.findByCategory(config.category);
    if (existing.some((c) => c.value.toLowerCase() === config.value!.toLowerCase())) {
      throw new Error('Value already exists for this category');
    }
    return this.configRepository.create(config);
  };

  getConfigsByCategory = async (category: string): Promise<IMentorshipConfig[]> => {
    const validCategories = [
      'mentorshipType',
      'targetAudience',
      'expertiseArea',
      'technology',
      'experienceLevel',
    ];
    if (!validCategories.includes(category)) {
      throw new Error('Invalid category');
    }
    return this.configRepository.findByCategory(category);
  };

  getAllConfigs = async (): Promise<IMentorshipConfig[]> => {
    return this.configRepository.findAll();
  };

  getConfigById = async (id: string): Promise<IMentorshipConfig> => {
    const config = await this.configRepository.findById(id);
    if (!config) {
      throw new Error('Configuration not found');
    }
    return config;
  };

  updateConfig = async (
    id: string,
    config: Partial<IMentorshipConfig>
  ): Promise<IMentorshipConfig> => {
    const updated = await this.configRepository.update(id, config);
    if (!updated) {
      throw new Error('Configuration not found');
    }
    return updated;
  };

  deleteConfig = async (id: string): Promise<void> => {
    const success = await this.configRepository.delete(id);
    if (!success) {
      throw new Error('Configuration not found');
    }
  };
}
