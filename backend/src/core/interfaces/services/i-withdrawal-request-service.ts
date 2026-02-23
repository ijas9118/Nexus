import type { WalletInfo } from "@/core/types/wallet.types";
import type { IWithdrawalRequest } from "@/models/payment/withdrawal-request.model";

export interface IWithdrawalRequestService {
  requestWithdrawal: (
    userId: string,
    amount: number,
    withdrawalNote: string,
    nexusPoints?: number,
  ) => Promise<void>;
  getPendingRequests: () => Promise<IWithdrawalRequest[]>;
  getRequestsByUserId: (
    userId: string,
    status?: "pending" | "approved" | "rejected",
  ) => Promise<IWithdrawalRequest[]>;
  approveWithdrawal: (requestId: string) => Promise<WalletInfo>;
  rejectWithdrawal: (requestId: string) => Promise<void>;
}
