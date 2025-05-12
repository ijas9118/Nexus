import { RequestHandler } from 'express';

export interface IWalletController {
  addMoney: RequestHandler;
  getWalletInfo: RequestHandler;
  addNexusPoints: RequestHandler;
  requestWithdrawal: RequestHandler;
}
