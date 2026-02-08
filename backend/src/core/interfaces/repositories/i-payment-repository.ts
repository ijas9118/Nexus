import type { IPayment } from "@/models/payment.model";

import type { IBaseRepository } from "./i-base-repository";

export interface IPaymentRepository extends IBaseRepository<IPayment> {
  createPayment: (data: Partial<IPayment>) => Promise<IPayment>;
}
