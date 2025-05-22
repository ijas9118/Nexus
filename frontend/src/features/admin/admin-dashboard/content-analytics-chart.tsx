import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/organisms/chart";

const data = [
  { month: "Jan", views: 4000, likes: 2400, premium: 1400 },
  { month: "Feb", views: 3000, likes: 1398, premium: 1210 },
  { month: "Mar", views: 2000, likes: 9800, premium: 1290 },
  { month: "Apr", views: 2780, likes: 3908, premium: 1000 },
  { month: "May", views: 1890, likes: 4800, premium: 1181 },
  { month: "Jun", views: 2390, likes: 3800, premium: 1500 },
  { month: "Jul", views: 3490, likes: 4300, premium: 1700 },
];

export function ContentAnalyticsChart() {
  return (
    <ChartContainer
      config={{
        views: {
          label: "Views",
          color: "hsl(var(--chart-1))",
        },
        likes: {
          label: "Likes",
          color: "hsl(var(--chart-2))",
        },
        premium: {
          label: "Premium Content",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[200px]"
    >
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tickMargin={10}
        />
        <YAxis axisLine={false} tickLine={false} tickMargin={10} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="views"
          stackId="1"
          stroke="var(--color-views)"
          fill="var(--color-views)"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="likes"
          stackId="2"
          stroke="var(--color-likes)"
          fill="var(--color-likes)"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="premium"
          stackId="3"
          stroke="var(--color-premium)"
          fill="var(--color-premium)"
          fillOpacity={0.6}
        />
      </AreaChart>
    </ChartContainer>
  );
}
