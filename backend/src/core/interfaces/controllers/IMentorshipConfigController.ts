import { RequestHandler } from 'express';

export interface IMentorshipConfigController {
  deleteConfig: RequestHandler;
  updateConfig: RequestHandler;
  getConfigById: RequestHandler;
  getAllConfigs: RequestHandler;
  getConfigsByCategory: RequestHandler;
  createConfig: RequestHandler;
}
