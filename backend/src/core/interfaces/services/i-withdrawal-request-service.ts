import type { IWithdrawalRequest } from "@/models/payment/withdrawal-request.model";

export interface IWithdrawalRequestService {
  createWithdrawalRequest: (
    userId: string,
    amount: number,
    withdrawalNote: string,
  ) => Promise<IWithdrawalRequest>;
  getPendingRequests: () => Promise<IWithdrawalRequest[]>;
  approveRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
}
