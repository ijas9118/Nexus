import { RequestHandler } from 'express';

export interface IConnectionsController {
  searchConnections: RequestHandler;
  getPendingRequests: RequestHandler;
  sendConnectionRequest: RequestHandler;
  acceptConnectionRequest: RequestHandler;
  hasSentConnectionRequest: RequestHandler;
  withdrawConnectionRequest: RequestHandler;
  isConnected: RequestHandler;
}
