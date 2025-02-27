import { RequestHandler } from "express";

export interface IChatController {
  createChat: RequestHandler;
  getAllChats: RequestHandler;
}