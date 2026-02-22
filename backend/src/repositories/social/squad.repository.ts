import { inject, injectable } from "inversify";
import mongoose from "mongoose";

import type { ISquadRepository } from "@/core/interfaces/repositories/i-squad-repository";
import type { IUserRepository } from "@/core/interfaces/repositories/i-user-repository";
import type { SearchCriteria, SearchResultItem } from "@/core/types/search";
import type { ISquadAggregated, SquadWithIsJoined } from "@/core/types/squad";
import type { ISquad } from "@/models/social/squads.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { TYPES } from "@/di/types";
import { SquadModel } from "@/models/social/squads.model";

@injectable()
export class SquadRepository extends BaseRepository<ISquad> implements ISquadRepository {
  constructor(@inject(TYPES.UserRepository) private _userRepository: IUserRepository) {
    super(SquadModel);
  }

  getSquadById = async (id: string): Promise<ISquad | null> => {
    const idObj = new mongoose.Types.ObjectId(id);
    return await this.findById(idObj);
  };

  getAllSquads = async ({
    limit,
    page,
    search,
  }: {
    limit: number;
    page: number;
    search: string;
  }): Promise<ISquadAggregated[]> => {
    const skip = (page - 1) * limit;

    // Build the search filter for the aggregation pipeline
    const searchFilter = search
      ? {
          $match: {
            name: { $regex: search, $options: "i" }, // Case-insensitive search on squad name
          },
        }
      : { $match: {} }; // No search filter if search is empty

    return await this._model.aggregate([
      searchFilter, // Apply search filter first
      {
        $lookup: {
          from: "users",
          localField: "admin",
          foreignField: "_id",
          as: "adminData",
        },
      },
      {
        $unwind: {
          path: "$adminData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          logo: 1,
          adminId: "$adminData._id",
          adminProfilePic: "$adminData.profilePic",
          adminName: "$adminData.name",
          name: 1,
          handle: 1,
          category: "$categoryData.name",
          membersCount: 1,
          isPremium: 1,
          isActive: 1,
        },
      },
      { $skip: skip }, // Pagination: skip records
      { $limit: limit }, // Pagination: limit records
    ]);
  };

  getJoinedSquads = async (userId: string): Promise<(ISquad & { isAdmin: boolean })[]> => {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const joinedSquads = await this._model.aggregate([
      {
        $match: {
          members: userObjectId,
        },
      },
      {
        $addFields: {
          isAdmin: {
            $eq: ["$admin", userObjectId],
          },
        },
      },
    ]);

    return joinedSquads;
  };

  getSquadDetailsByHandle = async (handle: string, userId: string): Promise<ISquad> => {
    const squadDetails = await SquadModel.aggregate([
      {
        $match: { handle: handle.toLowerCase() },
      },
      {
        $lookup: {
          from: "categories", // Category collection
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users", // Admin user
          localField: "admin",
          foreignField: "_id",
          as: "adminData",
        },
      },
      {
        $unwind: {
          path: "$adminData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          isJoined: {
            $in: [new mongoose.Types.ObjectId(userId), "$members"],
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          handle: 1,
          logo: 1,
          postCount: 1,
          viewCount: 1,
          upvoteCount: 1,
          membersCount: 1,
          isActive: 1,
          isPremium: 1,
          createdAt: 1,
          isJoined: 1,
          category: "$categoryData.name",
          admin: "$adminData._id",
          adminName: "$adminData.name",
          adminUsername: "$adminData.username",
          adminProfilePic: "$adminData.profilePic",
        },
      },
    ]);

    return squadDetails[0] || null;
  };

  getSquadsByCategory = async (
    categoryId: string,
    userId: string,
  ): Promise<SquadWithIsJoined[]> => {
    return await this._model.aggregate([
      {
        $match: {
          category: new mongoose.Types.ObjectId(categoryId),
          isActive: true,
        },
      },
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
                        cond: {
                          $eq: ["$$user._id", new mongoose.Types.ObjectId(userId)], // Cast userId to ObjectId
                        },
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
      {
        $project: {
          joinedUsers: 0,
        },
      },
    ]);
  };

  toggleSquad = async (id: string): Promise<ISquad | null> => {
    const objId = new mongoose.Types.ObjectId(id);

    const squad = await this.findById(objId);
    if (!squad) {
      return null;
    }

    return await this.update(objId, { isActive: !squad.isActive });
  };

  addMemberToSquad = async (userId: string, squadId: string) => {
    const squadObjId = new mongoose.Types.ObjectId(squadId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    await this._model.findByIdAndUpdate(squadObjId, {
      $addToSet: { members: userId },
      $inc: { membersCount: 1 },
    });
    await this._userRepository.findByIdAndUpdate(userObjectId, {
      $addToSet: { joinedSquads: squadId },
    });
  };

  search = async (criteria: SearchCriteria): Promise<SearchResultItem[]> => {
    const { query, limit } = criteria;

    const squads = await this._model
      .find({
        name: { $regex: query, $options: "i" },
      })
      .select("name category logo")
      .limit(limit || 10)
      .lean();

    return squads.map(squad => ({
      type: "squad",
      id: squad._id.toString(),
      title: squad.name,
      subtitle: squad.category,
      image: squad.logo,
    }));
  };

  removeMemberFromSquad = async (userId: string, squadId: string): Promise<void> => {
    const squadObjId = new mongoose.Types.ObjectId(squadId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    await this._model.findByIdAndUpdate(squadObjId, {
      $pull: { members: userObjectId },
      $inc: { membersCount: -1 }, // Decrement membersCount
    });
    await this._userRepository.findByIdAndUpdate(userObjectId, {
      $pull: { joinedSquads: squadObjId },
    });
  };

  async countSquads(): Promise<number> {
    return this._model.countDocuments({});
  }

  async countSquadsBefore(date: Date): Promise<number> {
    return this._model.countDocuments({
      createdAt: { $lt: date },
    });
  }
}
