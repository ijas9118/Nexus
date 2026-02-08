import { injectable } from 'inversify';
import { Types } from 'mongoose';

import type { SearchResultItem } from '@/core/types/search';

import type { IUserRepository } from '../core/interfaces/repositories/i-user-repository';
import type { ISquad } from '../models/squads.model';
import type { IUser } from '../models/user.model';

import { BaseRepository } from '../core/abstracts/base.repository';
import { UserModel } from '../models/user.model';

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async findUserById(id: string): Promise<IUser | null> {
    const objId = new Types.ObjectId(id);
    return this.findById(objId);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email });
  }

  async countUsers(): Promise<number> {
    return this.model.countDocuments({});
  }

  async countMentors(): Promise<number> {
    return this.model.countDocuments({ role: 'mentor' });
  }

  async countUsersBefore(date: Date): Promise<number> {
    return this.model.countDocuments({
      createdAt: { $lt: date },
    });
  }

  async countMentorsBefore(date: Date): Promise<number> {
    return this.model.countDocuments({
      role: 'mentor',
      createdAt: { $lt: date },
    });
  }

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return await UserModel.findOne({ googleId });
  }

  async findByGithubId(githubId: string): Promise<IUser | null> {
    return await UserModel.findOne({ githubId });
  }

  async getAllUsers(skip: number = 0, limit: number = 10): Promise<IUser[]> {
    return this.model.find({}).skip(skip).limit(limit).exec();
  }

  async addPostCount(userId: string): Promise<IUser | null> {
    const userObjectId = new Types.ObjectId(userId);
    return this.findByIdAndUpdate(userObjectId, {
      $inc: { postsCount: 1 },
    });
  }

  async updateUser(userId: string, userData: Partial<IUser>): Promise<IUser | null> {
    const userObjectId = new Types.ObjectId(userId);
    const user = await this.findOne({ username: userData.username });
    if (user) {
      throw new Error('Username already exists');
    }
    return this.model.findByIdAndUpdate(userObjectId, userData, { new: true });
  }

  async deleteUser(userId: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(userId);
    return result !== null;
  }

  async getUserById(userId: string): Promise<IUser | null> {
    const userObjectId = new Types.ObjectId(userId);
    return await this.findById(userObjectId);
  }

  async addSquadToUser(userId: string, squadId: string): Promise<boolean> {
    const userObjectId = new Types.ObjectId(userId);
    const squadObjId = new Types.ObjectId(squadId);
    const result = await this.findByIdAndUpdate(userObjectId, {
      $addToSet: { joinedSquads: squadObjId },
    });

    return result !== null;
  }

  async getUserJoinedSquads(userId: string): Promise<ISquad[]> {
    const user = await UserModel.findById(userId).populate('joinedSquads');
    if (!user) {
      throw new Error('User not found');
    }
    return user.joinedSquads as unknown as ISquad[];
  }

  async getUserByRoleAndId(role: string, id: string): Promise<IUser | null> {
    return UserModel.findOne({ _id: id, role }).exec();
  }

  getUserByUsername = async (username: string): Promise<IUser | null> => {
    return this.findOne({ username });
  };

  getUserIdByUsername = async (username: string): Promise<string | null> => {
    const user = await this.findOne({ username });
    return user ? user._id.toString() : null;
  };

  async updatePremiumStatus(userId: string, isPremium: boolean): Promise<IUser | null> {
    return this.findByIdAndUpdate(userId, { isPremium, role: 'premium' });
  }

  async search(criteria: { query: string; limit?: number }): Promise<SearchResultItem[]> {
    const users = await this.model
      .find({ $text: { $search: criteria.query } })
      .select('name username profilePic')
      .limit(criteria.limit ?? 20)
      .lean();

    return users.map((user) => ({
      id: user._id.toString(),
      type: 'user',
      title: user.name || user.username,
      snippet: user.username,
      image: user.profilePic,
    }));
  }
}
