import {
  DashboardStatsResponse,
  MentorApplicationStatsResponse,
  RevenueStatsResponse,
  SubscriptionStatsResponse,
} from "@/types/admin/dashboard";
import api from "../api";
import { LoginResponse } from "@/types/admin/auth";
import { ADMIN_ROUTES } from "@/utils/constants";

export const AdminService = {
  loginAdmin: (email: string, password: string): Promise<LoginResponse> =>
    api
      .post<LoginResponse>(ADMIN_ROUTES.LOGIN, { email, password })
      .then((res) => res.data),

  getDashboardStats: (): Promise<DashboardStatsResponse> =>
    api
      .get<DashboardStatsResponse>(`${ADMIN_ROUTES.DASHBOARD}/stats`)
      .then((res) => res.data),

  getSubscriptionStats: (): Promise<SubscriptionStatsResponse> =>
    api
      .get(`${ADMIN_ROUTES.DASHBOARD}/subscription-stats`)
      .then((res) => res.data),

  getRevenueStats: (timeRange: string): Promise<RevenueStatsResponse> =>
    api
      .get(`${ADMIN_ROUTES.DASHBOARD}/revenue-stats?timeRange=${timeRange}`)
      .then((res) => res.data),

  getMentorApplicationStats: (): Promise<MentorApplicationStatsResponse> =>
    api
      .get(`${ADMIN_ROUTES.DASHBOARD}/mentor-application-stats`)
      .then((res) => res.data),
};
