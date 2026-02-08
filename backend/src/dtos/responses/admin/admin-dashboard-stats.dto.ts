import { IsEnum, IsNumber, IsString } from "class-validator";

// Define trend type for better type safety
type TrendType = "up" | "down" | "flat";

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

  @IsString()
  userChange!: string;

  @IsEnum(["up", "down", "flat"])
  userTrend!: TrendType;

  @IsString()
  mentorChange!: string;

  @IsEnum(["up", "down", "flat"])
  mentorTrend!: TrendType;

  @IsString()
  contentChange!: string;

  @IsEnum(["up", "down", "flat"])
  contentTrend!: TrendType;

  @IsString()
  squadChange!: string;

  @IsEnum(["up", "down", "flat"])
  squadTrend!: TrendType;

  @IsString()
  subscriptionChange!: string;

  @IsEnum(["up", "down", "flat"])
  subscriptionTrend!: TrendType;

  static fromCounts(
    totalUsers: number,
    prevMonthUsers = 0,
    totalMentors: number,
    prevMonthMentors = 0,
    totalContents: number,
    prevMonthContents = 0,
    totalSquads: number,
    prevMonthSquads = 0,
    totalSubscription: number,
    prevMonthSubscription = 0,
  ): AdminDashboardStatsDTO {
    const dto = new AdminDashboardStatsDTO();

    // Set current counts
    dto.totalUsers = totalUsers;
    dto.totalMentors = totalMentors;
    dto.totalContents = totalContents;
    dto.totalSquads = totalSquads;
    dto.totalSubscription = totalSubscription;

    // Calculate change and trend for users
    const userChangeValue = calculatePercentageChangeValue(totalUsers, prevMonthUsers);
    dto.userChange = formatPercentageChange(userChangeValue);
    dto.userTrend = determineTrend(userChangeValue);

    // Calculate change and trend for mentors
    const mentorChangeValue = calculatePercentageChangeValue(totalMentors, prevMonthMentors);
    dto.mentorChange = formatPercentageChange(mentorChangeValue);
    dto.mentorTrend = determineTrend(mentorChangeValue);

    // Calculate change and trend for contents
    const contentChangeValue = calculatePercentageChangeValue(totalContents, prevMonthContents);
    dto.contentChange = formatPercentageChange(contentChangeValue);
    dto.contentTrend = determineTrend(contentChangeValue);

    // Calculate change and trend for squads
    const squadChangeValue = calculatePercentageChangeValue(totalSquads, prevMonthSquads);
    dto.squadChange = formatPercentageChange(squadChangeValue);
    dto.squadTrend = determineTrend(squadChangeValue);

    // Calculate change and trend for subscriptions
    const subscriptionChangeValue = calculatePercentageChangeValue(
      totalSubscription,
      prevMonthSubscription,
    );
    dto.subscriptionChange = formatPercentageChange(subscriptionChangeValue);
    dto.subscriptionTrend = determineTrend(subscriptionChangeValue);

    return dto;
  }
}

// Helper function to calculate percentage change value
function calculatePercentageChangeValue(current: number, previous: number): number {
  if (previous === 0)
    return 0;
  return ((current - previous) / previous) * 100;
}

// Helper function to format percentage change
function formatPercentageChange(changeValue: number): string {
  return `${changeValue > 0 ? "+" : ""}${changeValue.toFixed(0)}%`;
}

// Helper function to determine trend based on percentage change
function determineTrend(changeValue: number): TrendType {
  if (changeValue > 0)
    return "up";
  if (changeValue < 0)
    return "down";
  return "flat";
}
