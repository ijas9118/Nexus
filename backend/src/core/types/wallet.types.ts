export interface TransactionDetails {
  _id: string;
  type: 'incoming' | 'withdrawal';
  date: Date;
  amount: number;
  status: 'pending' | 'completed';
  details: {
    name?: string;
    profilePic?: string;
    withdrawalNote?: string;
  };
}

export interface WalletInfo {
  balance: number;
  transactions: TransactionDetails[];
}
