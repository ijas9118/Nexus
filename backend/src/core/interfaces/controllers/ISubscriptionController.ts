import { RequestHandler } from 'express';

export interface ISubscriptionController {
  getCurrentSubscription: RequestHandler;
}
