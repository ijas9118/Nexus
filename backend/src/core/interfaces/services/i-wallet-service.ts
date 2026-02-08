import type { WalletInfo } from '@/core/types/wallet.types';

export interface IWalletService {
  addMoney: (
    userId: string,
    amount: number,
    bookingId?: string,
    menteeId?: string
  ) => Promise<WalletInfo>;
  requestWithdrawal: (
    userId: string,
    amount: number,
    withdrawalNote: string,
    nexusPoints?: number
  ) => Promise<void>;
  approveWithdrawal: (requestId: string) => Promise<WalletInfo>;
  rejectWithdrawal: (requestId: string) => Promise<void>;
  addNexusPoints: (userId: string, points: number, description: string) => Promise<WalletInfo>;
  getWalletInfo: (userId: string, status?: 'pending' | 'completed') => Promise<WalletInfo>;
}
