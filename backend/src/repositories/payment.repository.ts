import { BaseRepository } from '@/core/abstracts/base.repository';
import { IPaymentRepository } from '@/core/interfaces/repositories/IPaymentRepository';
import { IPayment, PaymentModel } from '@/models/payment.model';
import { injectable } from 'inversify';

@injectable()
export class PaymentRepository extends BaseRepository<IPayment> implements IPaymentRepository {
  constructor() {
    super(PaymentModel);
  }

  async createPayment(data: Partial<IPayment>): Promise<IPayment> {
    return this.create(data);
  }
}
