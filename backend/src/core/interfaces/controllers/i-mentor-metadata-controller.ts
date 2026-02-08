import type { RequestHandler } from 'express';

export interface IMentorMetadataController {
  create: RequestHandler;
  restore: RequestHandler;
  softDelete: RequestHandler;
  update: RequestHandler;
  findByType: RequestHandler;
  findAll: RequestHandler;
  findById: RequestHandler;
}
