import { RequestHandler } from 'express';

export interface IHistoryController {
  removeFromHistory: RequestHandler;
  getAllHistory: RequestHandler;
}
