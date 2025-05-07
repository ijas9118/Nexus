import { RequestHandler } from 'express';

export interface IBookingPaymentController {
  checkoutSession: RequestHandler;
  verifySession: RequestHandler;
}
