import type { RequestHandler } from "express";

export interface IPaymentController {
  checkoutSession: RequestHandler;
  handleWebhook: RequestHandler;
  verifySession: RequestHandler;
}
