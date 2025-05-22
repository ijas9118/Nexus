import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/organisms/chart";

const data = [
  { name: "Pending", value: 12, color: "#3b82f6" },
  { name: "Approved", value: 45, color: "#22c55e" },
  { name: "Rejected", value: 8, color: "#ef4444" },
];

export function MentorApplicationsChart() {
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
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
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
