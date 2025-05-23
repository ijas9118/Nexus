import { type FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Atom,
  Compass,
  CreditCard,
  GraduationCap,
  Loader,
  User,
  ArrowUpRight,
  Minus,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Button } from "@/components/atoms/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { AdminService } from "@/services/admin/adminService";
import { RevenueChart } from "./admin-dashboard/revenue-chart";
import { MentorApplicationsChart } from "./admin-dashboard/mentor-applications-chart";
import { SubscriptionDistributionChart } from "./admin-dashboard/subscription-distribution-chart";

const Dashboard: FC = () => {
  const [timeRange, setTimeRange] = useState<
    "7days" | "30days" | "90days" | "year"
  >("7days");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: AdminService.getDashboardStats,
  });

  const {
    data: subscriptionData,
    isLoading: subscriptionLoading,
    isError: subscriptionError,
  } = useQuery({
    queryKey: ["subscriptionStats"],
    queryFn: AdminService.getSubscriptionStats,
  });

  const {
    data: revenueData,
    isLoading: revenueLoading,
    isError: revenueError,
  } = useQuery({
    queryKey: ["adminRevenueStats", timeRange],
    queryFn: () => AdminService.getRevenueStats(timeRange),
  });

  const {
    data: mentorApplicationData,
    isLoading: mentorApplicationLoading,
    isError: mentorApplicationError,
  } = useQuery({
    queryKey: ["mentorApplicationStats"],
    queryFn: AdminService.getMentorApplicationStats,
  });

  const stats = [
    {
      title: "Total Users",
      value: data?.totalUsers ?? "-",
      icon: <User />,
      change: data?.userChange ?? "+12%",
      trend: data?.userTrend ?? "up",
    },
    {
      title: "Total Mentors",
      value: data?.totalMentors ?? "-",
      icon: <GraduationCap />,
      change: data?.mentorChange ?? "+8%",
      trend: data?.mentorTrend ?? "up",
    },
    {
      title: "Active Squads",
      value: data?.totalSquads ?? "-",
      icon: <Compass />,
      change: data?.squadChange ?? "+5%",
      trend: data?.squadTrend ?? "up",
    },
    {
      title: "Contents",
      value: data?.totalContents ?? "-",
      icon: <Atom />,
      change: data?.contentChange ?? "+15%",
      trend: data?.contentTrend ?? "up",
    },
    {
      title: "Active Subscription",
      value: data?.totalSubscription ?? "-",
      icon: <CreditCard />,
      change: data?.subscriptionChange ?? "+10%",
      trend: data?.subscriptionTrend ?? "up",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8 space-y-8">
      {/* Stats Cards */}
      <div className="flex flex-wrap gap-3 md:grid md:grid-cols-2 lg:flex">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="flex-1 min-w-[150px] md:min-w-[200px] rounded-2xl bg-gradient-to-br from-white to-slate-100 dark:from-[#1f2937] dark:to-[#111827] shadow-md hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {stat.title}
              </CardTitle>
              <div className="p-2 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
                {isLoading ? (
                  <Loader className="animate-spin text-blue-500 w-6 h-6" />
                ) : isError ? (
                  "-"
                ) : (
                  stat.value
                )}
              </div>
              {!isLoading && !isError && (
                <p
                  className={`text-xs mt-1 flex items-center ${
                    stat.trend === "up"
                      ? "text-green-500"
                      : stat.trend === "down"
                        ? "text-red-500"
                        : "text-gray-500"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : stat.trend === "down" ? (
                    <ArrowUpRight className="w-3 h-3 mr-1 rotate-180" />
                  ) : (
                    <Minus className="w-3 h-3 mr-1" />
                  )}
                  {stat.change} from last month
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-white to-slate-100 dark:from-[#1f2937] dark:to-[#111827] shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Revenue Overview
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">
                Platform fees and subscription revenue
              </CardDescription>
            </div>
            <Select
              value={timeRange}
              onValueChange={(value) => setTimeRange(value as any)}
            >
              <SelectTrigger className="w-[140px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="pl-2">
            <RevenueChart
              data={revenueData}
              isLoading={revenueLoading}
              isError={revenueError}
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full rounded-2xl bg-gradient-to-br from-white to-slate-100 dark:from-[#1f2937] dark:to-[#111827] shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              Subscription Plans
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Distribution by plan type
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 flex items-center justify-center ">
            <SubscriptionDistributionChart
              data={subscriptionData}
              isLoading={subscriptionLoading}
              isError={subscriptionError}
            />
          </CardContent>

          <CardFooter className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {subscriptionLoading ? (
                  <Loader className="animate-spin text-blue-500 w-5 h-5" />
                ) : subscriptionError ? (
                  "-"
                ) : (
                  `₹${subscriptionData?.totalRevenue.toLocaleString() || "0"}`
                )}
              </p>
            </div>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Mentor Applications and Content Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl bg-gradient-to-br from-white to-slate-100 dark:from-[#1f2937] dark:to-[#111827] shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              Mentor Applications
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Status overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MentorApplicationsChart
              data={mentorApplicationData}
              isLoading={mentorApplicationLoading}
              isError={mentorApplicationError}
            />
          </CardContent>
          <CardFooter className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="w-full flex justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Pending:{" "}
                  {mentorApplicationData?.statusBreakdown.find(
                    (s) => s.status === "pending",
                  )?.count || 0}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Approved:{" "}
                  {mentorApplicationData?.statusBreakdown.find(
                    (s) => s.status === "approved",
                  )?.count || 0}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Rejected:{" "}
                  {mentorApplicationData?.statusBreakdown.find(
                    (s) => s.status === "rejected",
                  )?.count || 0}
                </span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
