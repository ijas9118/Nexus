import { RequestHandler } from 'express';

export interface IWithdrawalRequestController {
  rejectWithdrawal: RequestHandler;
  approveWithdrawal: RequestHandler;
  getPendingRequests: RequestHandler;
  getUserPendingRequests: RequestHandler;
}
