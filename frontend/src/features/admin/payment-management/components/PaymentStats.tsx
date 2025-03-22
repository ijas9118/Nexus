import { Card, CardContent } from "@/components/molecules/card";
import { IndianRupee, Users, TrendingUp, Package } from "lucide-react";

const stats = [
  {
    label: "Total Revenue",
    count: "₹84397.50",
    icon: IndianRupee,
    bg: "bg-teal-500/10",
    color: "text-teal-500",
  },
  {
    label: "Active Subscribers",
    count: 2000,
    icon: Users,
    bg: "bg-indigo-500/10",
    color: "text-indigo-500",
  },
  {
    label: "Avg. Conversion Rate",
    count: "2.80%",
    icon: TrendingUp,
    bg: "bg-amber-500/10",
    color: "text-amber-500",
  },
  {
    label: "Active Plans",
    count: 2,
    icon: Package,
    bg: "bg-emerald-500/10",
    color: "text-emerald-500",
  },
];

const PaymentStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {stats.map(({ label, count, icon: Icon, bg, color }) => (
        <Card key={label}>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {label}
              </p>
              <h3 className="text-3xl font-bold">{count}</h3>
            </div>
            <div className={`p-3 ${bg} rounded-full`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PaymentStats;
