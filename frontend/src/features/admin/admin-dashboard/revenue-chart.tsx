"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/organisms/chart";
import { Loader } from "lucide-react";
import { RevenueStatsResponse } from "@/types/admin/dashboard";

interface RevenueChartProps {
  data?: RevenueStatsResponse;
  isLoading?: boolean;
  isError?: boolean;
}

export function RevenueChart({
  data,
  isLoading = false,
  isError = false,
}: RevenueChartProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader className="animate-spin text-blue-500 w-6 h-6" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-[300px] text-sm text-slate-500 dark:text-slate-400">
        Failed to load revenue data
      </div>
    );
  }

  // If no data exists, show empty state
  if (data.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-sm text-slate-500 dark:text-slate-400">
        No revenue data available
      </div>
    );
  }

  return (
    <Tabs defaultValue="line">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))] mr-2"></div>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Platform Fees
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))] mr-2"></div>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Subscriptions
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-3))] mr-2"></div>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Total
            </span>
          </div>
        </div>
        <TabsList className="bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="line">Line</TabsTrigger>
          <TabsTrigger value="bar">Bar</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="line" className="mt-0">
        <ChartContainer
          config={{
            platformFees: {
              label: "Platform Fees",
              color: "hsl(var(--chart-1))",
            },
            subscriptions: {
              label: "Subscriptions",
              color: "hsl(var(--chart-2))",
            },
            total: {
              label: "Total",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <LineChart
            data={data.data}
            margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="platformFees"
              stroke="var(--color-platformFees)"
              strokeWidth={2}
              dot={{ fill: "var(--color-platformFees)" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="subscriptions"
              stroke="var(--color-subscriptions)"
              strokeWidth={2}
              dot={{ fill: "var(--color-subscriptions)" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="var(--color-total)"
              strokeWidth={2}
              dot={{ fill: "var(--color-total)" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </TabsContent>

      <TabsContent value="bar" className="mt-0">
        <ChartContainer
          config={{
            platformFees: {
              label: "Platform Fees",
              color: "hsl(var(--chart-1))",
            },
            subscriptions: {
              label: "Subscriptions",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <BarChart
            data={data.data}
            margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="platformFees"
              fill="var(--color-platformFees)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="subscriptions"
              fill="var(--color-subscriptions)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </TabsContent>
    </Tabs>
  );
}
