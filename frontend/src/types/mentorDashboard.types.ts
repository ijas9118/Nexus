export type EarningsResponse = {
  totalEarnings: number;
  percentageChange: number;
  changeDirection: "increase" | "decrease" | "noChange";
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
  _id: string;
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
  status: "unpaid" | "pending" | "confirmed" | "completed";
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
