"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/organisms/chart";
import { Loader } from "lucide-react";
import { MentorApplicationStatsResponse } from "@/types/admin/dashboard";

interface MentorApplicationsChartProps {
  data?: MentorApplicationStatsResponse;
  isLoading?: boolean;
  isError?: boolean;
}

export function MentorApplicationsChart({
  data,
  isLoading = false,
  isError = false,
}: MentorApplicationsChartProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader className="animate-spin text-blue-500 w-6 h-6" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-[200px] text-sm text-slate-500 dark:text-slate-400">
        Failed to load mentor application data
      </div>
    );
  }

  // If no applications exist, show empty state
  if (data.totalApplications === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-sm text-slate-500 dark:text-slate-400">
        No mentor applications available
      </div>
    );
  }

  // Format data for the chart
  const chartData = data.statusBreakdown.map((status) => ({
    name: status.status.charAt(0).toUpperCase() + status.status.slice(1),
    value: status.count,
    percentage: status.percentage,
    color: status.color,
  }));

  // Filter out statuses with zero applications for the chart
  const chartDataFiltered = chartData.filter((status) => status.value > 0);

  return (
    <ChartContainer
      config={{
        pending: {
          label: "Pending",
          color: "hsl(216, 92%, 58%)",
        },
        approved: {
          label: "Approved",
          color: "hsl(142, 71%, 45%)",
        },
        rejected: {
          label: "Rejected",
          color: "hsl(0, 84%, 60%)",
        },
      }}
      className="h-[200px]"
    >
      <PieChart>
        <Pie
          data={chartDataFiltered}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
        >
          {chartDataFiltered.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(_value, _name, props) => {
                const entry = props.payload;
                return [
                  [`Count: ${entry.value}`, ""],
                  [`Percentage: ${entry.percentage}%`, ""],
                ];
              }}
            />
          }
        />
      </PieChart>
    </ChartContainer>
  );
}
