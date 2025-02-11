import { Request, Response } from "express";

export interface IMentorController {
  sendInvitation(req: Request, res: Response): Promise<void>;
  acceptInvitation(req: Request, res: Response): Promise<void>;
}
