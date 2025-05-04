import { RequestHandler } from 'express';

export interface IMentorshipTypeController {
  create: RequestHandler;
  getById: RequestHandler;
  getAll: RequestHandler;
  update: RequestHandler;
  delete: RequestHandler;
}
