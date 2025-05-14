import { MentorDashboardData } from "./types";

export const mockData: MentorDashboardData = {
  totalEarnings: 2450,
  pendingWithdrawal: 350,
  completedSessions: 28,
  upcomingSessions: 5,
  pendingBookings: 3,
  walletBalance: 1200,
  recentBookings: [
    {
      id: "1",
      user: "Alex Johnson",
      type: "Career Guidance",
      date: "May 15, 2025",
      time: "10:00 AM",
      status: "confirmed",
      avatar: "/placeholder.svg",
    },
    {
      id: "2",
      user: "Sarah Williams",
      type: "Project Review",
      date: "May 16, 2025",
      time: "2:30 PM",
      status: "confirmed",
      avatar: "/placeholder.svg",
    },
    {
      id: "3",
      user: "Michael Chen",
      type: "Technical Interview Prep",
      date: "May 17, 2025",
      time: "11:00 AM",
      status: "pending",
      avatar: "/placeholder.svg",
    },
  ],
  recentTransactions: [
    {
      id: "tx1",
      type: "incoming",
      amount: 120,
      date: "May 12, 2025",
      status: "completed",
      from: "Alex Johnson",
    },
    {
      id: "tx2",
      type: "withdrawal",
      amount: 500,
      date: "May 10, 2025",
      status: "completed",
    },
    {
      id: "tx3",
      type: "incoming",
      amount: 80,
      date: "May 8, 2025",
      status: "completed",
      from: "Sarah Williams",
    },
  ],
  mentorshipTypes: [
    {
      name: "Career Guidance",
      bookings: 15,
      percentage: 55,
    },
    {
      name: "Project Review",
      bookings: 8,
      percentage: 30,
    },
    {
      name: "Technical Interview Prep",
      bookings: 4,
      percentage: 15,
    },
  ],
};
