import { ISquad } from "../../../models/squads.model";

export interface ISquadService {
  joinSquad(userId: string, squadId: string): unknown;
  getSquadsByCategory(userId: string, category: string): unknown;
  toggleSquad(id: string): unknown;
  createSquad(squadData: Partial<ISquad>): Promise<ISquad>;
  getSquadByName(name: string): Promise<ISquad | null>;
  getAllSquads(): Promise<ISquad[]>;
  getSquadById(id: string): Promise<ISquad | null>;
}
