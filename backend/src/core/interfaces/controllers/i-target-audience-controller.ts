import type { RequestHandler } from 'express';

export interface ITargetAudienceController {
  create: RequestHandler;
  getAll: RequestHandler;
  getById: RequestHandler;
  update: RequestHandler;
  softDelete: RequestHandler;
  restore: RequestHandler;
}
