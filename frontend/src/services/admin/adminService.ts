import {
  DashboardStatsResponse,
  SubscriptionStatsResponse,
} from "@/types/admin/dashboard";
import api from "../api";
import { LoginResponse } from "@/types/admin/auth";

export const AdminService = {
  loginAdmin: (email: string, password: string): Promise<LoginResponse> =>
    api
      .post<LoginResponse>("/admin/login", { email, password })
      .then((res) => res.data),

  getDashboardStats: (): Promise<DashboardStatsResponse> =>
    api
      .get<DashboardStatsResponse>("/admin/dashboard/stats")
      .then((res) => res.data),

  getSubscriptionStats: (): Promise<SubscriptionStatsResponse> =>
    api.get("/admin/dashboard/subscription-stats").then((res) => res.data),
};
