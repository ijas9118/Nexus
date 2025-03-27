import { RequestHandler } from 'express';

export interface IMessageController {
  getAllMessages: RequestHandler;
  getUsersWithChats: RequestHandler;
}
