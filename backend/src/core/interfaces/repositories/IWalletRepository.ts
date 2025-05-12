import { TransactionDetails } from '@/core/types/wallet.types';
import { ITransaction } from '@/models/transaction.model';
import { IWallet } from '@/models/wallet.model';
import { IBaseRepository } from './IBaseRepository';

export interface IWalletRepository extends IBaseRepository<IWallet> {
  getWalletByUserId(userId: string): Promise<IWallet | null>;
  updateWalletBalance(
    walletId: string,
    amount: number,
    transactionId: string
  ): Promise<IWallet | null>;
  addTransaction(transaction: Partial<ITransaction>): Promise<ITransaction>;
  getTransactionsByUserId(
    userId: string,
    status?: 'pending' | 'completed'
  ): Promise<TransactionDetails[]>;
}
