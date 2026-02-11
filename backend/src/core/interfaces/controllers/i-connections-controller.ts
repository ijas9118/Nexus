import type { RequestHandler } from "express";

export interface IConnectionsController {
  searchConnections: RequestHandler;
  getPendingRequests: RequestHandler;
  getSentConnectionRequests: RequestHandler;
  sendConnectionRequest: RequestHandler;
  acceptConnectionRequest: RequestHandler;
  rejectConnectionRequest: RequestHandler;
  hasSentConnectionRequest: RequestHandler;
  withdrawConnectionRequest: RequestHandler;
  removeConnection: RequestHandler;
  isConnected: RequestHandler;
  getAllConnections: RequestHandler;
}
