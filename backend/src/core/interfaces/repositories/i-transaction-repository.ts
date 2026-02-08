import type { ITransaction } from '@/models/transaction.model';

import type { IBaseRepository } from './i-base-repository';

export interface ITransactionRepository extends IBaseRepository<ITransaction> {
  getTransactionsByDateRange: (startDate: Date, endDate: Date) => Promise<ITransaction[]>;
  countTransactionsByDateRange: (startDate: Date, endDate: Date) => Promise<number>;
  getTransactionRevenueByDateGroups: (
    startDate: Date,
    endDate: Date,
    groupByFormat: string
  ) => Promise<Array<{ date: string; revenue: number }>>;
}
