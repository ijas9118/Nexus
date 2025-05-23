import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/organisms/chart";
import { SubscriptionStatsResponse } from "@/types/admin/dashboard";
import { Loader } from "lucide-react";

interface SubscriptionDistributionChartProps {
  data?: SubscriptionStatsResponse;
  isLoading?: boolean;
  isError?: boolean;
}

export function SubscriptionDistributionChart({
  data,
  isLoading = false,
  isError = false,
}: SubscriptionDistributionChartProps) {
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
        Failed to load subscription data
      </div>
    );
  }

  // If no subscriptions exist, show empty state
  if (data.totalSubscriptions === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-sm text-slate-500 dark:text-slate-400">
        No subscription data available
      </div>
    );
  }

  // Format data for the chart
  const chartData = data.plans.map((plan) => ({
    name: plan.tier,
    value: plan.count,
    percentage: plan.percentage,
    revenue: plan.revenue,
    color: plan.color,
  }));

  // Filter out plans with zero subscriptions for the chart
  const chartDataFiltered = chartData.filter((plan) => plan.value > 0);

  return (
    <div className="space-y-4">
      <ChartContainer
        config={{
          spark: {
            label: "Spark (1 month)",
          },
          flame: {
            label: "Flame (6 months)",
          },
          fire: {
            label: "Fire (12 months)",
          },
        }}
        className="w-full h-[200px]" // Takes available space
      >
        <PieChart>
          <Pie
            data={chartDataFiltered}
            cx="50%"
            cy="50%"
            outerRadius="70%" // Scales with container size
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            labelLine={true} // Enables label lines to position labels outside
          >
            {chartDataFiltered.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ChartContainer>
      <div className="grid grid-cols-3 gap-2 text-center">
        {chartData.map((plan) => (
          <div key={plan.name} className="flex flex-col">
            <div className="flex items-center justify-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: plan.color }}
              ></div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {plan.name}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {plan.value} users
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ₹{plan.revenue.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
