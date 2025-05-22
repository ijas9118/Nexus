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
  Calendar,
  DollarSign,
  Filter,
  ChevronDown,
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
import { ContentAnalyticsChart } from "./admin-dashboard/content-analytics-chart";
import { SubscriptionDistributionChart } from "./admin-dashboard/subscription-distribution-chart";
import { RecentTransactions } from "./admin-dashboard/recent-transactions";
import { BookingStatusChart } from "./admin-dashboard/booking-status-chart";

const Dashboard: FC = () => {
  const [timeRange, setTimeRange] = useState<
    "7days" | "30days" | "90days" | "year"
  >("30days");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: AdminService.getDashboardStats,
  });

  // const { data: revenueData } = useQuery({
  //   queryKey: ["adminRevenueStats", timeRange],
  //   queryFn: () => AdminService.getRevenueStats(timeRange),
  // });

  const stats = [
    {
      title: "Total Users",
      value: data?.totalUsers ?? "-",
      icon: <User />,
      change: "+12%",
      trend: "up",
    },
    {
      title: "Total Mentors",
      value: data?.totalMentors ?? "-",
      icon: <GraduationCap />,
      change: "+8%",
      trend: "up",
    },
    {
      title: "Active Squads",
      value: data?.totalSquads ?? "-",
      icon: <Compass />,
      change: "+5%",
      trend: "up",
    },
    {
      title: "Contents",
      value: data?.totalContents ?? "-",
      icon: <Atom />,
      change: "+15%",
      trend: "up",
    },
    {
      title: "Active Subscription",
      value: data?.totalSubscription ?? "-",
      icon: <CreditCard />,
      change: "+10%",
      trend: "up",
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
                  className={`text-xs mt-1 flex items-center ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowUpRight className="w-3 h-3 mr-1 rotate-180" />
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
            <RevenueChart />
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-white to-slate-100 dark:from-[#1f2937] dark:to-[#111827] shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              Subscription Plans
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Distribution by plan type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubscriptionDistributionChart />
          </CardContent>
          <CardFooter className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                $12,845
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
            <MentorApplicationsChart />
          </CardContent>
          <CardFooter className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="w-full flex justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Pending: 12
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Approved: 45
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Rejected: 8
                </span>
              </div>
            </div>
          </CardFooter>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-white to-slate-100 dark:from-[#1f2937] dark:to-[#111827] shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              Content Analytics
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Views, likes and engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContentAnalyticsChart />
          </CardContent>
          <CardFooter className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="grid grid-cols-3 w-full gap-2">
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Views
                </p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  24.5K
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Avg. Likes
                </p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  78
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Premium %
                </p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  35%
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Bookings and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-2xl bg-gradient-to-br from-white to-slate-100 dark:from-[#1f2937] dark:to-[#111827] shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              Booking Status
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Mentorship session status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingStatusChart />
          </CardContent>
          <CardFooter className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm mr-3">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    This Week
                  </p>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    32 Sessions
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-sm mr-3">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Revenue
                  </p>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    $1,280
                  </p>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-white to-slate-100 dark:from-[#1f2937] dark:to-[#111827] shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Recent Transactions
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">
                Platform fees and withdrawals
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-200 dark:border-slate-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            <RecentTransactions />
          </CardContent>
          <CardFooter className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <Button
              variant="outline"
              className="w-full border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
            >
              View All Transactions
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
