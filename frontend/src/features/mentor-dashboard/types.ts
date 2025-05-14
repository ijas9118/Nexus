export interface Booking {
  id: string;
  user: string;
  type: string;
  date: string;
  time: string;
  status: "confirmed" | "pending";
  avatar: string;
}

export interface Transaction {
  id: string;
  type: "incoming" | "withdrawal";
  amount: number;
  date: string;
  status: "completed";
  from?: string;
}

export interface MentorshipType {
  name: string;
  bookings: number;
  percentage: number;
}

export interface MentorDashboardData {
  totalEarnings: number;
  pendingWithdrawal: number;
  completedSessions: number;
  upcomingSessions: number;
  pendingBookings: number;
  walletBalance: number;
  recentBookings: Booking[];
  recentTransactions: Transaction[];
  mentorshipTypes: MentorshipType[];
}
