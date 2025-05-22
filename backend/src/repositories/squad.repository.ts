import mongoose from 'mongoose';
import { BaseRepository } from '../core/abstracts/base.repository';
import { ISquadRepository } from '../core/interfaces/repositories/ISquadRepository';
import { ISquad, SquadModel } from '../models/squads.model';
import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import { IUserRepository } from '../core/interfaces/repositories/IUserRepository';
import { SearchCriteria, SearchResultItem } from '@/core/types/search';
import { SquadWithIsJoined } from '@/core/types/squad';

@injectable()
export class SquadRepository extends BaseRepository<ISquad> implements ISquadRepository {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {
    super(SquadModel);
  }

  getSquadById = async (id: string): Promise<ISquad | null> => {
    const idObj = new mongoose.Types.ObjectId(id);
    return await this.findById(idObj);
  };

  getAllSquads = async (): Promise<ISquad[]> => {
    return await this.find({});
  };

  getJoinedSquads = async (userId: string): Promise<(ISquad & { isAdmin: boolean })[]> => {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const joinedSquads = await this.model.aggregate([
      {
        $match: {
          members: userObjectId,
        },
      },
      {
        $addFields: {
          isAdmin: {
            $eq: ['$admin', userObjectId],
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
          from: 'categories', // Category collection
          localField: 'category',
          foreignField: '_id',
          as: 'categoryData',
        },
      },
      {
        $unwind: {
          path: '$categoryData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users', // Admin user
          localField: 'admin',
          foreignField: '_id',
          as: 'adminData',
        },
      },
      {
        $unwind: {
          path: '$adminData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          isJoined: {
            $in: [new mongoose.Types.ObjectId(userId), '$members'],
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
          category: '$categoryData.name',
          admin: '$adminData._id',
          adminName: '$adminData.name',
          adminUsername: '$adminData.username',
          adminProfilePic: '$adminData.profilePic',
        },
      },
    ]);

    return squadDetails[0] || null;
  };

  getSquadsByCategory = async (
    categoryId: string,
    userId: string
  ): Promise<SquadWithIsJoined[]> => {
    return await this.model.aggregate([
      {
        $match: {
          category: new mongoose.Types.ObjectId(categoryId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'joinedSquads',
          as: 'joinedUsers',
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
                        input: '$joinedUsers',
                        as: 'user',
                        cond: {
                          $eq: ['$$user._id', new mongoose.Types.ObjectId(userId)], // Cast userId to ObjectId
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

    await this.model.findByIdAndUpdate(squadObjId, {
      $addToSet: { members: userId },
      $inc: { membersCount: 1 },
    });
    await this.userRepository.findByIdAndUpdate(userObjectId, {
      $addToSet: { joinedSquads: squadId },
    });
  };

  search = async (criteria: SearchCriteria): Promise<SearchResultItem[]> => {
    const { query, limit } = criteria;

    const squads = await this.model
      .find({
        name: { $regex: query, $options: 'i' },
      })
      .select('name category logo')
      .limit(limit || 10)
      .lean();

    return squads.map((squad) => ({
      type: 'squad',
      id: squad._id.toString(),
      title: squad.name,
      subtitle: squad.category,
      image: squad.logo,
    }));
  };

  removeMemberFromSquad = async (userId: string, squadId: string): Promise<void> => {
    const squadObjId = new mongoose.Types.ObjectId(squadId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    await this.model.findByIdAndUpdate(squadObjId, {
      $pull: { members: userObjectId },
      $inc: { membersCount: -1 }, // Decrement membersCount
    });
    await this.userRepository.findByIdAndUpdate(userObjectId, {
      $pull: { joinedSquads: squadObjId },
    });
  };

  async countSquads(): Promise<number> {
    return this.model.countDocuments({});
  }
}
