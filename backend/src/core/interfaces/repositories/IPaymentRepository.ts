import { IPayment } from '@/models/payment.model';
import { IBaseRepository } from './IBaseRepository';

export interface IPaymentRepository extends IBaseRepository<IPayment> {
  createPayment(data: Partial<IPayment>): Promise<IPayment>;
}
