import { RequestHandler } from 'express';

export interface IGlobalSearchController {
  search: RequestHandler;
}
