import { Request, Response } from "express";

export interface ISquadController {
  createSquad(req: Request, res: Response): Promise<void>;
  getAllSquads(req: Request, res: Response): Promise<void>;
}
