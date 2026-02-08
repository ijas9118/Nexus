import type { RequestHandler } from 'express';

export interface IPlanController {
  createPlan: RequestHandler;
  deletePlan: RequestHandler;
  updatePlan: RequestHandler;
  getPlanById: RequestHandler;
  getAllPlans: RequestHandler;
}
