import { RequestHandler } from 'express';

export interface IPlanController {
  createPlan: RequestHandler;
}
