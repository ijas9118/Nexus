export interface MentorDashboardData {
  totalEarnings: number;
  pendingWithdrawal: number;
  completedSessions: number;
  upcomingSessions: number;
  pendingBookings: number;
  walletBalance: number;
  recentBookings: {
    id: string;
    user: string;
    type: string;
    date: string;
    time: string;
    status: string;
    avatar: string;
  }[];
  recentTransactions: {
    id: string;
    type: 'incoming' | 'withdrawal';
    amount: number;
    date: string;
    status: 'completed' | 'pending' | 'failed';
    from?: string;
  }[];
  mentorshipTypes: {
    name: string;
    bookings: number;
    percentage: number;
  }[];
}

export type EarningsResponse = {
  totalEarnings: number;
  percentageChange: number;
  changeDirection: 'increase' | 'decrease' | 'noChange';
};

export type PendingWithdrawalsResponse = {
  pendingWithdrawal: number;
  balance: number;
};

export type SessionStatsResponse = {
  completed: number;
  upcoming: number;
  pending: number;
};

export type RecentBooking = {
  userId: {
    name: string;
    profilePic: string;
  };
  mentorshipType: {
    name: string;
  };
  timeSlot: {
    startTime: string;
  };
  bookingDate: string;
  status: 'unpaid' | 'pending' | 'confirmed' | 'completed';
};

export type RecentTransaction = {
  // Define actual transaction shape here
  _id: string;
  amount: number;
  type: string;
  createdAt: string;
};

export type MentorshipTypeStats = {
  name: string;
  bookings: number;
  percentage: number;
};
