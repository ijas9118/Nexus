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

const mockRevenueData = [
  { date: "Jan", platformFees: 2400, subscriptions: 1800, total: 4200 },
  { date: "Feb", platformFees: 1800, subscriptions: 2000, total: 3800 },
  { date: "Mar", platformFees: 2800, subscriptions: 2200, total: 5000 },
  { date: "Apr", platformFees: 3200, subscriptions: 2400, total: 5600 },
  { date: "May", platformFees: 2900, subscriptions: 2600, total: 5500 },
  { date: "Jun", platformFees: 3500, subscriptions: 2800, total: 6300 },
  { date: "Jul", platformFees: 3800, subscriptions: 3000, total: 6800 },
];

export function RevenueChart({ data = mockRevenueData }) {
  return (
    <Tabs defaultValue="line">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Platform Fees
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Subscriptions
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
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
            data={data}
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
            data={data}
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
