import { RequestHandler } from 'express';

export interface IPaymentController {
  checkoutSession: RequestHandler;
}
