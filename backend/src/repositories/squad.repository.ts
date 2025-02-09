import mongoose from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { ISquadRepository } from "../core/interfaces/repositories/ISquadRepository";
import { ISquad, SquadModel } from "../models/squads.model";
import { injectable } from "inversify";

@injectable()
export class SquadRepository extends BaseRepository<ISquad> implements ISquadRepository {
  constructor() {
    super(SquadModel);
  }

  getSquadById = async (id: string): Promise<ISquad | null> => {
    const idObj = new mongoose.Types.ObjectId(id);
    return await this.findById(idObj);
  };

  getAllSquads = async (): Promise<ISquad[]> => {
    return await this.find({});
  };

  toggleSquad = async (id: string): Promise<ISquad | null> => {
    const objId = new mongoose.Types.ObjectId(id);

    const squad = await this.findById(objId);
    if (!squad) return null;

    return await this.update(objId, { isActive: !squad.isActive });
  };
}
