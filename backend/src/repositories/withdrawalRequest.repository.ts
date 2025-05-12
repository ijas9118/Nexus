import { injectable } from 'inversify';
import mongoose from 'mongoose';
import { BaseRepository } from '@/core/abstracts/base.repository';
import { IWithdrawalRequestRepository } from '@/core/interfaces/repositories/IWithdrawalRequestRepository';
import { IWithdrawalRequest, WithdrawalRequestModel } from '@/models/withdrawalRequest.model';

@injectable()
export class WithdrawalRequestRepository
  extends BaseRepository<IWithdrawalRequest>
  implements IWithdrawalRequestRepository
{
  constructor() {
    super(WithdrawalRequestModel);
  }

  async getRequestsByUserId(
    userId: string,
    status?: 'pending' | 'approved' | 'rejected'
  ): Promise<IWithdrawalRequest[]> {
    const query: any = { userId };
    if (status) query.status = status;
    return await WithdrawalRequestModel.find(query).exec();
  }

  async getPendingRequests(): Promise<IWithdrawalRequest[]> {
    return await WithdrawalRequestModel.find({ status: 'pending' })
      .populate('userId', 'name email role')
      .exec();
  }

  async updateRequestStatus(
    requestId: string,
    status: 'approved' | 'rejected',
    transactionId?: string
  ): Promise<IWithdrawalRequest | null> {
    const update: any = { status };
    if (transactionId) update.transactionId = new mongoose.Types.ObjectId(transactionId);
    return await WithdrawalRequestModel.findByIdAndUpdate(requestId, update, { new: true }).exec();
  }
}
