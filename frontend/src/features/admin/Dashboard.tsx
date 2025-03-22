import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import {
  Atom,
  Bell,
  Compass,
  CreditCard,
  FileCheck,
  FileX,
  GraduationCap,
  User,
  Zap,
} from "lucide-react";
import { FC } from "react";
import UserGrowthGraph from "./components/UserGrowthGraph";

interface Activity {
  id: number;
  type: "mentor" | "content-approved" | "notification" | "content-rejected";
  title: string;
  description: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: 1,
    type: "mentor",
    title: "New Mentor Application",
    description: "Sarah Johnson applied to become a mentor",
    time: "2m ago",
  },
  {
    id: 2,
    type: "content-approved",
    title: "Content Approved",
    description: "Tech blog post approved and published",
    time: "15m ago",
  },
  {
    id: 3,
    type: "notification",
    title: "Notification Sent",
    description: "System update notification sent to all users",
    time: "1hr ago",
  },
  {
    id: 4,
    type: "mentor",
    title: "New Mentor Application",
    description: "Afsal M applied to become a mentor",
    time: "2h ago",
  },
  {
    id: 5,
    type: "content-rejected",
    title: "Content Rejected",
    description: "Tech video post rejected",
    time: "2hr 15m ago",
  },
  {
    id: 6,
    type: "notification",
    title: "Notification Sent",
    description: "System update notification sent to all users",
    time: "3hr ago",
  },
];

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "mentor":
      return (
        <div className="p-2 rounded-lg border-[0.5px]">
          <Zap />
        </div>
      );
    case "content-approved":
      return (
        <div className="p-2 rounded-lg border-[0.5px]">
          <FileCheck />
        </div>
      );
    case "notification":
      return (
        <div className="p-2 rounded-lg border-[0.5px]">
          <Bell />
        </div>
      );
    case "content-rejected":
      return (
        <div className="p-2 rounded-lg border-[0.5px]">
          <FileX />
        </div>
      );
  }
};

const Dashboard: FC = () => {
  const stats = [
    {
      title: "Total Users",
      value: "10,230",
      subtext: "320 new this month",
      icon: <User />,
    },
    {
      title: "Total Mentors",
      value: "120",
      subtext: "5 pending application",
      icon: <GraduationCap />,
    },
    {
      title: "Active Squads",
      value: "54",
      subtext: "8 new this week",
      icon: <Compass />,
    },
    {
      title: "Contents",
      value: "2,450",
      subtext: "12 pending review",
      icon: <Atom />,
    },
    {
      title: "Active Subscription",
      value: "460",
      subtext: "2 new this week",
      icon: <CreditCard />,
    },
  ];
  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8">
      <div className="flex flex-wrap gap-3 md:grid md:grid-cols-2 lg:flex">
        {stats.map((stat, index) => (
          <Card key={index} className="flex-1 min-w-[150px] md:min-w-[200px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-normal">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="my-6 flex gap-4 ">
        <UserGrowthGraph />
        <div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-normal">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                >
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-sm">{activity.description}</p>
                  </div>
                  <p className="text-sm">{activity.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
