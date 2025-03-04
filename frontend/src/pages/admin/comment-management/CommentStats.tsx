import { Card, CardContent } from "@/components/ui/card";
import { Users, Flag, Trash2, BarChart } from "lucide-react";

const stats = [
  {
    label: "Total Comments",
    count: 102,
    icon: Users,
    bg: "bg-primary/10",
    color: "text-primary",
  },
  {
    label: "Reported",
    count: 12,
    icon: Flag,
    bg: "bg-amber-500/10",
    color: "text-destructive",
  },
  {
    label: "Deleted",
    count: 32,
    icon: Trash2,
    bg: "bg-destructive/10",
    color: "text-destructive",
  },
  {
    label: "New Today",
    count: 12,
    icon: BarChart,
    bg: "bg-green-500/10",
    color: "text-green-500",
  },
];

const CommentStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {stats.map(({ label, count, icon: Icon, bg, color }) => (
        <Card key={label}>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
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

export default CommentStats;
