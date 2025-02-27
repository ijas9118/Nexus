import { RequestHandler } from "express";

export interface IMessageController {
  createNewMessage: RequestHandler;
  getAllMessages: RequestHandler;
}
