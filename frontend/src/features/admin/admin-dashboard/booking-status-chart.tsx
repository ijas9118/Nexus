import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/organisms/chart";

const data = [
  { name: "Pending", value: 42, color: "#f59e0b" },
  { name: "Confirmed", value: 28, color: "#3b82f6" },
  { name: "Completed", value: 85, color: "#22c55e" },
  { name: "Cancelled", value: 8, color: "#ef4444" },
];

export function BookingStatusChart() {
  return (
    <ChartContainer
      config={{
        pending: {
          label: "Pending",
          color: "hsl(38, 92%, 50%)",
        },
        confirmed: {
          label: "Confirmed",
          color: "hsl(216, 92%, 58%)",
        },
        completed: {
          label: "Completed",
          color: "hsl(142, 71%, 45%)",
        },
        cancelled: {
          label: "Cancelled",
          color: "hsl(0, 84%, 60%)",
        },
      }}
      className="h-[200px]"
    >
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
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
