import type { RequestHandler } from 'express';

export interface ISubscriptionController {
  getCurrentSubscription: RequestHandler;
}
