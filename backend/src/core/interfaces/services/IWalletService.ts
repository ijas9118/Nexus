import { WalletInfo } from '@/core/types/wallet.types';
import { IBaseService } from './IBaseService';
import { IWallet } from '@/models/wallet.model';

export interface IWalletService extends IBaseService<IWallet> {
  addMoney(
    userId: string,
    amount: number,
    bookingId?: string,
    menteeId?: string
  ): Promise<WalletInfo>;
  withdrawMoney(userId: string, amount: number, withdrawalNote: string): Promise<WalletInfo>;
  getWalletInfo(userId: string, status?: 'pending' | 'completed'): Promise<WalletInfo>;
}
