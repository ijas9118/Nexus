import { Card, CardContent } from "@/components/ui/card";
import { BarChart, FileText, Video, Pencil } from "lucide-react";

const stats = [
  {
    label: "Total Contents",
    count: 142,
    icon: FileText,
    bg: "bg-blue-500/10",
    color: "text-blue-500",
  },
  {
    label: "Video Content",
    count: 12,
    icon: Video,
    bg: "bg-purple-500/10",
    color: "text-purple-500",
  },
  {
    label: "Blog Content",
    count: 34,
    icon: Pencil,
    bg: "bg-orange-500/10",
    color: "text-orange-500",
  },
  {
    label: "New Today",
    count: 12,
    icon: BarChart,
    bg: "bg-green-500/10",
    color: "text-green-500",
  },
];

const ContentStats = () => {
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

export default ContentStats;
