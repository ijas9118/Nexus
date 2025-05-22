import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { IAdminDashboardService } from '@/core/interfaces/services/IAdminDashboardService';
import { IUserRepository } from '@/core/interfaces/repositories/IUserRepository';
import { IContentRepository } from '@/core/interfaces/repositories/IContentRepository';
import { ISquadRepository } from '@/core/interfaces/repositories/ISquadRepository';
import { ISubscriptionRepository } from '@/core/interfaces/repositories/ISubscriptionRepository';
import { AdminDashboardStatsDTO } from '@/dtos/responses/admin/AdminDashboardStats.dto';

@injectable()
export class AdminDashboardService implements IAdminDashboardService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.ContentRepository) private contentRepo: IContentRepository,
    @inject(TYPES.SquadRepository) private squadRepo: ISquadRepository,
    @inject(TYPES.SubscriptionRepository) private subscriptionRepo: ISubscriptionRepository
  ) {}

  getStats = async (): Promise<AdminDashboardStatsDTO> => {
    const totalUsers = await this.userRepository.countUsers();
    const totalMentors = await this.userRepository.countMentors();
    const totalContents = await this.contentRepo.countContents();
    const totalSquads = await this.squadRepo.countSquads();
    const totalSubscription = await this.subscriptionRepo.countSubscription();

    return AdminDashboardStatsDTO.fromCounts(
      totalUsers,
      totalMentors,
      totalContents,
      totalSquads,
      totalSubscription
    );
  };
}
