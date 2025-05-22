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
      icon: <User />,
    },
    {
      title: "Total Mentors",
      value: "120",
      icon: <GraduationCap />,
    },
    {
      title: "Active Squads",
      value: "54",
      icon: <Compass />,
    },
    {
      title: "Contents",
      value: "2,450",
      icon: <Atom />,
    },
    {
      title: "Active Subscription",
      value: "460",
      icon: <CreditCard />,
    },
  ];
  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8">
      <div className="flex flex-wrap gap-3 md:grid md:grid-cols-2 lg:flex">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="flex-1 min-w-[150px] md:min-w-[200px] rounded-2xl bg-gradient-to-br from-white to-slate-100 dark:from-[#1f2937] dark:to-[#111827] shadow-md hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {stat.title}
              </CardTitle>
              <div className="p-2 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
                {stat.value}
              </div>
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
