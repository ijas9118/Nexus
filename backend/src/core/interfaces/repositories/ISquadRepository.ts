import { ISquad } from "../../../models/squads.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface ISquadRepository extends BaseRepository<ISquad> {
  getSquadById(id: string): Promise<ISquad | null>;
  getAllSquads(): Promise<ISquad[]>;
}
