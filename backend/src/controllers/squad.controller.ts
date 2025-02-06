import { Request, Response } from "express";
import { ISquadController } from "../core/interfaces/controllers/ISquadController";
import { SquadService } from "../services/squad.service";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";

@injectable()
export class SquadController implements ISquadController {
  constructor(@inject(TYPES.SquadService) private squadService: SquadService) {}

  createSquad = async (req: Request, res: Response): Promise<void> => {
    try {
      const existingSquad = await this.squadService.getSquadByName(req.body.name);
      if (existingSquad) {
        res.status(400).json({ message: "Squad with this name already exists" });
        return;
      }

      const squad = await this.squadService.createSquad(req.body);
      res.status(201).json(squad);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating squad", error: error.message });
    }
  };

  getAllSquads = async (req: Request, res: Response): Promise<void> => {
    try {
      const squads = await this.squadService.getAllSquads();
      res.status(200).json(squads);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching squads", error: error.message });
    }
  };

  toggleSquad = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const toggleSquad = await this.squadService.toggleSquad(id);
      if (toggleSquad) {
        res.status(200).json(toggleSquad);
      } else {
        res.status(404).json({ message: "Squad not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error toggling squad", error: error.message });
    }
  };
}
