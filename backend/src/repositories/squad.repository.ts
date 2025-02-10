import mongoose from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { ISquadRepository } from "../core/interfaces/repositories/ISquadRepository";
import { ISquad, SquadModel } from "../models/squads.model";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { UserRepository } from "./user.repository";

@injectable()
export class SquadRepository extends BaseRepository<ISquad> implements ISquadRepository {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {
    super(SquadModel);
  }

  getSquadById = async (id: string): Promise<ISquad | null> => {
    const idObj = new mongoose.Types.ObjectId(id);
    return await this.findById(idObj);
  };

  getAllSquads = async (): Promise<ISquad[]> => {
    return await this.find({});
  };

  getSquadsByCategory = async (category: string, userId: string): Promise<any[]> => {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    return await this.model.aggregate([
      { $match: { category } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "joinedSquads",
          as: "joinedUsers",
        },
      },
      {
        $addFields: {
          isJoined: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$joinedUsers",
                        as: "user",
                        cond: { $eq: ["$$user._id", userObjectId] },
                      },
                    },
                  },
                  0,
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      { $project: { joinedUsers: 0, members: 0 } },
    ]);
  };

  toggleSquad = async (id: string): Promise<ISquad | null> => {
    const objId = new mongoose.Types.ObjectId(id);

    const squad = await this.findById(objId);
    if (!squad) return null;

    return await this.update(objId, { isActive: !squad.isActive });
  };

  addMemberToSquad = async (userId: string, squadId: string) => {
    const squadObjId = new mongoose.Types.ObjectId(squadId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    await this.model.findByIdAndUpdate(squadObjId, { $addToSet: { members: userId } });
    await this.userRepository.findByIdAndUpdate(userObjectId, {
      $addToSet: { joinedSquads: squadId },
    });
  };
}
