import { inject, injectable } from "inversify";

import type { IContentRepository } from "@/core/interfaces/repositories/i-content-repository";
import type { IMentorRepository } from "@/core/interfaces/repositories/i-mentor-repository";
import type { ISquadRepository } from "@/core/interfaces/repositories/i-squad-repository";
import type { ISubscriptionRepository } from "@/core/interfaces/repositories/i-subscription-repository";
import type { ITransactionRepository } from "@/core/interfaces/repositories/i-transaction-repository";
import type { IUserRepository } from "@/core/interfaces/repositories/i-user-repository";
import type { IAdminDashboardService } from "@/core/interfaces/services/i-admin-dashboard-service";
import type { RevenueDataPointDTO } from "@/dtos/responses/admin/revenue-stats-dto";

import { TYPES } from "@/di/types";
import { AdminDashboardStatsDTO } from "@/dtos/responses/admin/admin-dashboard-stats.dto";
import {
  MentorApplicationStatsDTO,
  MentorApplicationStatusDTO,
} from "@/dtos/responses/admin/mentor-application-stats-dto";
import { RevenueStatsDTO } from "@/dtos/responses/admin/revenue-stats-dto";
import {
  SubscriptionPlanStatsDTO,
  SubscriptionStatsDTO,
} from "@/dtos/responses/admin/subscription-stats-dto";

@injectable()
export class AdminDashboardService implements IAdminDashboardService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.ContentRepository) private contentRepo: IContentRepository,
    @inject(TYPES.SquadRepository) private squadRepo: ISquadRepository,
    @inject(TYPES.SubscriptionRepository) private subscriptionRepo: ISubscriptionRepository,
    @inject(TYPES.TransactionRepository) private transactionRepo: ITransactionRepository,
    @inject(TYPES.MentorRepository) private mentorRepo: IMentorRepository,
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
    const prevMonthSubscription
      = await this.subscriptionRepo.countSubscriptionBefore(prevMonthDate);

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
      prevMonthSubscription,
    );
  };

  getSubscriptionStats = async (): Promise<SubscriptionStatsDTO> => {
    const stats = await this.subscriptionRepo.getSubscriptionStats();

    // Define colors for each tier
    const tierColors = {
      Spark: "#3b82f6", // Blue
      Flame: "#8b5cf6", // Purple
      Fire: "#ec4899", // Pink
      // Default color for any other tiers
      default: "#94a3b8",
    };

    // Calculate percentages and create DTOs
    const planDTOs: SubscriptionPlanStatsDTO[] = stats.planStats.map((plan) => {
      const percentage
        = stats.totalSubscriptions > 0 ? (plan.count / stats.totalSubscriptions) * 100 : 0;

      const dto = new SubscriptionPlanStatsDTO();
      dto.tier = plan.tier;
      dto.count = plan.count;
      dto.percentage = Number.parseFloat(percentage.toFixed(1));
      dto.revenue = plan.revenue;
      dto.color = tierColors[plan.tier as keyof typeof tierColors] || tierColors.default;

      return dto;
    });

    // Sort by tier in a specific order: Spark, Flame, Fire
    const tierOrder = ["Spark", "Flame", "Fire"];
    planDTOs.sort((a, b) => {
      const indexA = tierOrder.indexOf(a.tier);
      const indexB = tierOrder.indexOf(b.tier);
      return indexA - indexB;
    });

    return SubscriptionStatsDTO.create(stats.totalRevenue, stats.totalSubscriptions, planDTOs);
  };

  getRevenueStats = async (timeRange: string): Promise<RevenueStatsDTO> => {
    // Calculate date range based on timeRange
    const endDate = new Date();
    const startDate = new Date();
    let groupByFormat: string;

    switch (timeRange) {
      case "7days":
        startDate.setDate(endDate.getDate() - 7);
        groupByFormat = "day";
        break;
      case "30days":
        startDate.setDate(endDate.getDate() - 30);
        groupByFormat = "day";
        break;
      case "90days":
        startDate.setDate(endDate.getDate() - 90);
        groupByFormat = "week";
        break;
      case "year":
        startDate.setFullYear(endDate.getFullYear() - 1);
        groupByFormat = "month";
        break;
      default:
        startDate.setDate(endDate.getDate() - 30); // Default to 30 days
        groupByFormat = "day";
    }

    // Get platform fees from transactions (20% of transaction amount)
    const platformFees = await this.transactionRepo.getTransactionRevenueByDateGroups(
      startDate,
      endDate,
      groupByFormat,
    );

    // Get subscription revenue
    const subscriptionRevenue = await this.subscriptionRepo.getSubscriptionRevenueByDateGroups(
      startDate,
      endDate,
      groupByFormat,
    );

    // Combine the data and calculate totals
    const dateMap = new Map<string, RevenueDataPointDTO>();

    // Initialize with all dates in the range
    const allDates = this.generateDateRange(startDate, endDate, groupByFormat);
    allDates.forEach((date) => {
      dateMap.set(date, {
        date,
        platformFees: 0,
        subscriptions: 0,
        total: 0,
      });
    });

    // Add platform fees data
    platformFees.forEach((item) => {
      const dataPoint = dateMap.get(item.date) || {
        date: item.date,
        platformFees: 0,
        subscriptions: 0,
        total: 0,
      };
      dataPoint.platformFees = Math.round(item.revenue);
      dataPoint.total = dataPoint.platformFees + dataPoint.subscriptions;
      dateMap.set(item.date, dataPoint);
    });

    // Add subscription revenue data
    subscriptionRevenue.forEach((item) => {
      const dataPoint = dateMap.get(item.date) || {
        date: item.date,
        platformFees: 0,
        subscriptions: 0,
        total: 0,
      };
      dataPoint.subscriptions = Math.round(item.revenue);
      dataPoint.total = dataPoint.platformFees + dataPoint.subscriptions;
      dateMap.set(item.date, dataPoint);
    });

    // Convert map to sorted array
    const revenueData = Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    return RevenueStatsDTO.create(revenueData);
  };

  getMentorApplicationStats = async (): Promise<MentorApplicationStatsDTO> => {
    const stats = await this.mentorRepo.countMentorsByStatus();

    // Define colors for each status
    const statusColors = {
      pending: "#3b82f6", // Blue
      approved: "#22c55e", // Green
      rejected: "#ef4444", // Red
    };

    // Calculate percentages and create DTOs
    const statusDTOs: MentorApplicationStatusDTO[] = stats.statusCounts.map((statusCount) => {
      const percentage
        = stats.totalApplications > 0 ? (statusCount.count / stats.totalApplications) * 100 : 0;

      const dto = new MentorApplicationStatusDTO();
      dto.status = statusCount.status;
      dto.count = statusCount.count;
      dto.percentage = Number.parseFloat(percentage.toFixed(1));
      dto.color = statusColors[statusCount.status as keyof typeof statusColors] || "#94a3b8";

      return dto;
    });

    // Sort by status in a specific order: pending, approved, rejected
    const statusOrder = ["pending", "approved", "rejected"];
    statusDTOs.sort((a, b) => {
      const indexA = statusOrder.indexOf(a.status);
      const indexB = statusOrder.indexOf(b.status);
      return indexA - indexB;
    });

    return MentorApplicationStatsDTO.create(stats.totalApplications, statusDTOs);
  };

  private generateDateRange(startDate: Date, endDate: Date, groupByFormat: string): string[] {
    const dates: string[] = [];
    const currentDate = new Date(startDate);
    const endTime = endDate.getTime();

    while (currentDate.getTime() <= endTime) {
      let dateStr: string;
      if (groupByFormat === "day") {
        dateStr = currentDate.toISOString().split("T")[0];
      }
      else if (groupByFormat === "week") {
        const year = currentDate.getFullYear();
        const weekNum = this.getWeekNumber(currentDate);
        dateStr = `${year}-${weekNum.toString().padStart(2, "0")}`;
      }
      else if (groupByFormat === "month") {
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        dateStr = `${year}-${month}`;
      }
      else {
        dateStr = currentDate.toISOString().split("T")[0];
      }
      dates.push(dateStr);

      if (groupByFormat === "day") {
        currentDate.setDate(currentDate.getDate() + 1);
      }
      else if (groupByFormat === "week") {
        currentDate.setDate(currentDate.getDate() + 7);
      }
      else if (groupByFormat === "month") {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      else {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return dates;
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }
}
