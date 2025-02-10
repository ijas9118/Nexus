import { Request, Response } from "express";
import { ISquadController } from "../core/interfaces/controllers/ISquadController";
import { SquadService } from "../services/squad.service";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { CustomRequest } from "../core/types/CustomRequest";

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

  getSquadsByCategory = async (req: Request, res: Response): Promise<void> => {
    const category = req.query.category as string;
    if (!category) {
      res.status(400).json({ message: "Category is required" });
    }

    try {
      const squads = await this.squadService.getSquadsByCategory(category);
      res.status(200).json(squads);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching squads", error: error.message });
    }
  };

  joinSquad = async (req: CustomRequest, res: Response): Promise<void> => {
    console.log("asdfadsf");
    const userId = req.user?._id as string;
    const { squadId } = req.params;

    try {
      if (!userId) res.status(400).json({ message: "User ID is required" });

      await this.squadService.joinSquad(userId, squadId);
      res.status(200).json({ message: "Successfully joined squad" });
    } catch (error: any) {
      res.status(500).json({ message: "Error joining squad", error: error.message });
    }
  };
}
