import { inject, injectable } from "inversify";

import type { IWithdrawalRequestRepository } from "@/core/interfaces/repositories/i-withdrawal-request-repository";
import type { IWalletService } from "@/core/interfaces/services/i-wallet-service";
import type { IWithdrawalRequestService } from "@/core/interfaces/services/i-withdrawal-request-service";
import type { WalletInfo } from "@/core/types/wallet.types";
import type { IWithdrawalRequest } from "@/models/payment/withdrawal-request.model";

import { TYPES } from "@/di/types";

@injectable()
export class WithdrawalRequestService implements IWithdrawalRequestService {
  constructor(
    @inject(TYPES.WithdrawalRequestRepository)
    private withdrawalRequestRepository: IWithdrawalRequestRepository,
    @inject(TYPES.WalletService) private walletService: IWalletService,
  ) {}

  async requestWithdrawal(
    userId: string,
    amount: number,
    withdrawalNote: string,
    nexusPoints?: number,
  ): Promise<void> {
    return this.walletService.requestWithdrawal(userId, amount, withdrawalNote, nexusPoints);
  }

  async getPendingRequests(): Promise<IWithdrawalRequest[]> {
    return this.withdrawalRequestRepository.getPendingRequests();
  }

  async getRequestsByUserId(
    userId: string,
    status?: "pending" | "approved" | "rejected",
  ): Promise<IWithdrawalRequest[]> {
    return this.withdrawalRequestRepository.getRequestsByUserId(userId, status);
  }

  async approveWithdrawal(requestId: string): Promise<WalletInfo> {
    return this.walletService.approveWithdrawal(requestId);
  }

  async rejectWithdrawal(requestId: string): Promise<void> {
    return this.walletService.rejectWithdrawal(requestId);
  }
}
