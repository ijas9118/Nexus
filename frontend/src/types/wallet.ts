export interface TransactionDetails {
  _id: string;
  transactionId?: string;
  type: "incoming" | "withdrawal";
  date: Date;
  amount: number;
  status: "pending" | "completed";
  details: {
    name?: string;
    profilePic?: string;
    withdrawalNote?: string;
  };
}

export interface PointTransaction {
  _id: string;
  points: number;
  type: "earned" | "redeemed";
  description: string;
  createdAt: Date;
}

export interface IWithdrawalRequest {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    profilePic?: string;
    role?: string;
    type?: string;
  };
  amount?: number;
  nexusPoints?: number;
  status: "pending" | "approved" | "rejected";
  withdrawalNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IWallet {
  balance: number;
  nexusPoints: number;
  transactions: TransactionDetails[];
  pointTransactions: PointTransaction[];
}
