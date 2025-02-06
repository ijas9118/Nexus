import { ISquad } from "../../../models/squads.model";

export interface ISquadService {
  createSquad(squadData: Partial<ISquad>): Promise<ISquad>;
  getSquadByName(name: string): Promise<ISquad | null>;
  getAllSquads(): Promise<ISquad[]>;
  getSquadById(id: string): Promise<ISquad | null>;
}
