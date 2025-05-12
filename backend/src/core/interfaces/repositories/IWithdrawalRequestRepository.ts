import { IBaseRepository } from '@/core/interfaces/repositories/IBaseRepository';
import { IWithdrawalRequest } from '@/models/withdrawalRequest.model';

export interface IWithdrawalRequestRepository extends IBaseRepository<IWithdrawalRequest> {
  getRequestsByUserId(
    userId: string,
    status?: 'pending' | 'approved' | 'rejected'
  ): Promise<IWithdrawalRequest[]>;
  getPendingRequests(): Promise<IWithdrawalRequest[]>;
  updateRequestStatus(
    requestId: string,
    status: 'approved' | 'rejected',
    transactionId?: string
  ): Promise<IWithdrawalRequest | null>;
}
