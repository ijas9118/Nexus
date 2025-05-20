import { RequestHandler } from 'express';

export interface ISquadController {
  createSquad: RequestHandler;
  getAllSquads: RequestHandler;
  toggleSquad: RequestHandler;
  getSquadsByCategory: RequestHandler;
  joinSquad: RequestHandler;
  getSquadDetailsByHandle: RequestHandler;
  getSquadContents: RequestHandler;
}
