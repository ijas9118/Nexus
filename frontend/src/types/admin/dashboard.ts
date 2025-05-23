export interface DashboardStatsResponse {
  totalUsers: number;
  totalMentors: number;
  totalContents: number;
  totalSquads: number;
  totalSubscription: number;
  userChange: string;
  userTrend: TrendType;
  mentorChange: string;
  mentorTrend: TrendType;
  contentChange: string;
  contentTrend: TrendType;
  squadChange: string;
  squadTrend: TrendType;
  subscriptionChange: string;
  subscriptionTrend: TrendType;
}

export type TrendType = ["up", "down", "flat"];

export interface SubscriptionPlanStats {
  tier: string;
  count: number;
  percentage: number;
  revenue: number;
  color: string;
}

export interface SubscriptionStatsResponse {
  totalRevenue: number;
  totalSubscriptions: number;
  plans: SubscriptionPlanStats[];
}
export interface RevenueDataPoint {
  date: string;
  platformFees: number;
  subscriptions: number;
  total: number;
}

export interface RevenueStatsResponse {
  data: RevenueDataPoint[];
}

export interface MentorApplicationStatus {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface MentorApplicationStatsResponse {
  totalApplications: number;
  statusBreakdown: MentorApplicationStatus[];
}
