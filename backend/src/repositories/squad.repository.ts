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
    return await SquadModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $project: {
          _id: 1,
          name: 1,
          membersCount: 1,
          logo: 1,
          isActive: 1,
          category: "$categoryDetails.name",
        },
      },
    ]);
  };

  toggleSquad = async (id: string): Promise<ISquad | null> => {
    const objId = new mongoose.Types.ObjectId(id);

    const squad = await this.findById(objId);
    if (!squad) return null;

    return await this.update(objId, { isActive: !squad.isActive });
  };
}
