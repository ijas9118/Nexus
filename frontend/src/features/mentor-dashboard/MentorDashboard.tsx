import { IndianRupee, Users, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/molecules/card";
import { Button } from "@/components/atoms/button";
import { StatCard } from "./components/StatCard";
import { mockData } from "./mockDashboardData";
import { BookingList } from "./components/BookingList";
import { MentorshipProgress } from "./components/MentorshipProgress";
import { TransactionList } from "./components/TransactionList";
import { useQuery } from "@tanstack/react-query";
import MentorDashboardService from "@/services/mentorDashboardService";

export default function MentorDashboard() {
  const { data: earnings } = useQuery({
    queryKey: ["mentorEarnings"],
    queryFn: MentorDashboardService.getEarnings,
  });
  const { data: withdrawals } = useQuery({
    queryKey: ["mentorWithdrawals"],
    queryFn: MentorDashboardService.getPendingWithdrawals,
  });
  const { data: sessions } = useQuery({
    queryKey: ["mentorSessions"],
    queryFn: MentorDashboardService.getSessionStats,
  });
  const { data: bookings } = useQuery({
    queryKey: ["mentorBookings"],
    queryFn: MentorDashboardService.getRecentBookings,
  });
  // const { data: transactions } = useQuery({
  //   queryKey: ["mentorTransactions"],
  //   queryFn: MentorDashboardService.getRecentTransactions,
  // });
  // const { data: mentorshipTypes } = useQuery({
  //   queryKey: ["mentorTypes"],
  //   queryFn: MentorDashboardService.getMentorshipTypes,
  // });

  console.log(bookings);

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your mentorship overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Earnings"
          value={`₹${earnings?.totalEarnings}`}
          icon={<IndianRupee className="h-4 w-4" />}
          subtext={`${earnings?.changeDirection === "increase" ? `+${earnings?.percentageChange}%` : `-${earnings?.percentageChange}%`} from last month`}
        />
        <StatCard
          title="Completed Sessions"
          value={sessions?.completed ?? 0}
          icon={<Users className="h-4 w-4" />}
          subtext="+4 since last month"
        />
        <StatCard
          title="Upcoming Sessions"
          value={sessions?.upcoming ?? 0}
          icon={<Calendar className="h-4 w-4" />}
          subtext={`${sessions?.pending} pending approval`}
        />
        <StatCard
          title="Wallet Balance"
          value={`₹${withdrawals?.balance}`}
          icon={<IndianRupee className="h-4 w-4" />}
          subtext={`₹${withdrawals?.pendingWithdrawal} pending withdrawal`}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 flex flex-col h-full">
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>
              You have {sessions?.upcoming} sessions scheduled.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1">
            <BookingList bookings={bookings ?? []} />
          </CardContent>

          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/dashboard/bookings">
                View all bookings <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Popular Mentorship Types</CardTitle>
            <CardDescription>Distribution by session type.</CardDescription>
          </CardHeader>
          <CardContent>
            <MentorshipProgress mentorshipTypes={mockData.mentorshipTypes} />
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/dashboard/mentorship-types">
                Manage mentorship types <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Track your earnings and withdrawals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionList transactions={mockData.recentTransactions} />
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to="/dashboard/wallet">
              View all transactions <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
