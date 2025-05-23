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
