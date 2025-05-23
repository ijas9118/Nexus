import type React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Shield, Users, FileText, Clock } from "lucide-react";
import { SquadStats } from "../SquadAdminDashboard";

interface StatsOverviewProps {
  stats?: SquadStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <StatCard
        title="Total Squads"
        value={stats.totalSquads}
        description="Across all categories"
        icon={<Shield className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Total Members"
        value={stats.totalMembers.toLocaleString()}
        description="Active community members"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Total Content"
        value={stats.totalContent.toLocaleString()}
        description="Articles, videos, and posts"
        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Pending Content"
        value={stats.pendingContent}
        description="Awaiting verification"
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Moderators"
        value={stats.totalModerators}
        description="Helping manage content"
        icon={<Shield className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
