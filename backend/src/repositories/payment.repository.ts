import { injectable } from "inversify";

import type { IPaymentRepository } from "@/core/interfaces/repositories/i-payment-repository";
import type { IPayment } from "@/models/payment.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { PaymentModel } from "@/models/payment.model";

@injectable()
export class PaymentRepository extends BaseRepository<IPayment> implements IPaymentRepository {
  constructor() {
    super(PaymentModel);
  }

  async createPayment(data: Partial<IPayment>): Promise<IPayment> {
    return this.create(data);
  }
}
