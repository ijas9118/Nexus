import type { TransactionDetails } from "@/core/types/wallet.types";
import type { ITransaction } from "@/models/payment/transaction.model";
import type { IWallet } from "@/models/payment/wallet.model";

import type { IBaseRepository } from "./i-base-repository";

export interface IWalletRepository extends IBaseRepository<IWallet> {
  getWalletByUserId: (userId: string) => Promise<IWallet | null>;
  updateWalletBalance: (
    walletId: string,
    amount: number,
    transactionId: string,
  ) => Promise<IWallet | null>;
  addTransaction: (transaction: Partial<ITransaction>) => Promise<ITransaction>;
  getTransactionsByUserId: (
    userId: string,
    status?: "pending" | "completed",
  ) => Promise<TransactionDetails[]>;
}
