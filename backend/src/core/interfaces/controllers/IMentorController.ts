import { RequestHandler } from "express";

export interface IMentorController {
  sendInvitation: RequestHandler;
  acceptInvitation: RequestHandler;
  getAllMentors: RequestHandler;
  completeProfile: RequestHandler;
}
