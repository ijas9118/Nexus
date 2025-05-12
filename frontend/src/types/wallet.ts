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

export interface IWallet {
  balance: number;
  nexusPoints: number;
  transactions: TransactionDetails[];
  pointTransactions: PointTransaction[];
}
