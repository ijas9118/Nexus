import type { IBaseRepository } from "@/core/interfaces/repositories/i-base-repository";
import type { IWithdrawalRequest } from "@/models/withdrawal-request.model";

export interface IWithdrawalRequestRepository extends IBaseRepository<IWithdrawalRequest> {
  getRequestsByUserId: (
    userId: string,
    status?: "pending" | "approved" | "rejected",
  ) => Promise<IWithdrawalRequest[]>;
  getPendingRequests: () => Promise<IWithdrawalRequest[]>;
  updateRequestStatus: (
    requestId: string,
    status: "approved" | "rejected",
    transactionId?: string,
  ) => Promise<IWithdrawalRequest | null>;
}
