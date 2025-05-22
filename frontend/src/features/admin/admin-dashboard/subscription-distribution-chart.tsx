import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/organisms/chart";

const data = [
  { name: "Spark", value: 45, color: "#3b82f6" },
  { name: "Flame", value: 30, color: "#8b5cf6" },
  { name: "Fire", value: 25, color: "#ec4899" },
];

export function SubscriptionDistributionChart() {
  return (
    <ChartContainer
      config={{
        spark: {
          label: "Spark (1 month)",
          color: "hsl(216, 92%, 58%)",
        },
        flame: {
          label: "Flame (6 months)",
          color: "hsl(258, 90%, 66%)",
        },
        fire: {
          label: "Fire (12 months)",
          color: "hsl(330, 81%, 60%)",
        },
      }}
      className="h-[200px]"
    >
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  );
}
