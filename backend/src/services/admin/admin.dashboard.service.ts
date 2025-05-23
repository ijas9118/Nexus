import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { IAdminDashboardService } from '@/core/interfaces/services/IAdminDashboardService';
import { IUserRepository } from '@/core/interfaces/repositories/IUserRepository';
import { IContentRepository } from '@/core/interfaces/repositories/IContentRepository';
import { ISquadRepository } from '@/core/interfaces/repositories/ISquadRepository';
import { ISubscriptionRepository } from '@/core/interfaces/repositories/ISubscriptionRepository';
import { AdminDashboardStatsDTO } from '@/dtos/responses/admin/AdminDashboardStats.dto';
import {
  SubscriptionPlanStatsDTO,
  SubscriptionStatsDTO,
} from '@/dtos/responses/admin/SubscriptionStatsDTO';

@injectable()
export class AdminDashboardService implements IAdminDashboardService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.ContentRepository) private contentRepo: IContentRepository,
    @inject(TYPES.SquadRepository) private squadRepo: ISquadRepository,
    @inject(TYPES.SubscriptionRepository) private subscriptionRepo: ISubscriptionRepository
  ) {}

  getStats = async (): Promise<AdminDashboardStatsDTO> => {
    // Get current counts
    const totalUsers = await this.userRepository.countUsers();
    const totalMentors = await this.userRepository.countMentors();
    const totalContents = await this.contentRepo.countContents();
    const totalSquads = await this.squadRepo.countSquads();
    const totalSubscription = await this.subscriptionRepo.countSubscription();

    // Get previous month counts
    const prevMonthDate = new Date();
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);

    const prevMonthUsers = await this.userRepository.countUsersBefore(prevMonthDate);
    const prevMonthMentors = await this.userRepository.countMentorsBefore(prevMonthDate);
    const prevMonthContents = await this.contentRepo.countContentsBefore(prevMonthDate);
    const prevMonthSquads = await this.squadRepo.countSquadsBefore(prevMonthDate);
    const prevMonthSubscription =
      await this.subscriptionRepo.countSubscriptionBefore(prevMonthDate);

    return AdminDashboardStatsDTO.fromCounts(
      totalUsers,
      prevMonthUsers,
      totalMentors,
      prevMonthMentors,
      totalContents,
      prevMonthContents,
      totalSquads,
      prevMonthSquads,
      totalSubscription,
      prevMonthSubscription
    );
  };

  getSubscriptionStats = async (): Promise<SubscriptionStatsDTO> => {
    const stats = await this.subscriptionRepo.getSubscriptionStats();

    // Define colors for each tier
    const tierColors = {
      Spark: '#3b82f6', // Blue
      Flame: '#8b5cf6', // Purple
      Fire: '#ec4899', // Pink
      // Default color for any other tiers
      default: '#94a3b8',
    };

    // Calculate percentages and create DTOs
    const planDTOs: SubscriptionPlanStatsDTO[] = stats.planStats.map((plan) => {
      const percentage =
        stats.totalSubscriptions > 0 ? (plan.count / stats.totalSubscriptions) * 100 : 0;

      const dto = new SubscriptionPlanStatsDTO();
      dto.tier = plan.tier;
      dto.count = plan.count;
      dto.percentage = Number.parseFloat(percentage.toFixed(1));
      dto.revenue = plan.revenue;
      dto.color = tierColors[plan.tier as keyof typeof tierColors] || tierColors.default;

      return dto;
    });

    // Sort by tier in a specific order: Spark, Flame, Fire
    const tierOrder = ['Spark', 'Flame', 'Fire'];
    planDTOs.sort((a, b) => {
      const indexA = tierOrder.indexOf(a.tier);
      const indexB = tierOrder.indexOf(b.tier);
      return indexA - indexB;
    });

    return SubscriptionStatsDTO.create(stats.totalRevenue, stats.totalSubscriptions, planDTOs);
  };
}
