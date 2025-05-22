import { IsNumber } from 'class-validator';

export class AdminDashboardStatsDTO {
  @IsNumber()
  totalUsers!: number;

  @IsNumber()
  totalMentors!: number;

  @IsNumber()
  totalContents!: number;

  @IsNumber()
  totalSquads!: number;

  @IsNumber()
  totalSubscription!: number;

  static fromCounts(
    totalUsers: number,
    totalMentors: number,
    totalContents: number,
    totalSquads: number,
    totalSubscription: number
  ): AdminDashboardStatsDTO {
    const dto = new AdminDashboardStatsDTO();
    dto.totalUsers = totalUsers;
    dto.totalMentors = totalMentors;
    dto.totalContents = totalContents;
    dto.totalSquads = totalSquads;
    dto.totalSubscription = totalSubscription;
    return dto;
  }
}
