import mongoose from 'mongoose';
import { BaseRepository } from '../core/abstracts/base.repository';
import { HistoryModel, IHistory } from '../models/history.model';
import { IHistoryRepository } from '../core/interfaces/repositories/IHistoryRepository';
import { injectable } from 'inversify';

@injectable()
export class HistoryRepository extends BaseRepository<IHistory> implements IHistoryRepository {
  constructor() {
    super(HistoryModel);
  }

  async addHistory(userId: string, contentId: string): Promise<IHistory> {
    return await this.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $addToSet: { readHistory: new mongoose.Types.ObjectId(contentId) } }
    );
  }

  removeFromHistory = async (userId: string, contentId: string): Promise<IHistory> => {
    const userObjId = new mongoose.Types.ObjectId(userId);
    const contentObjId = new mongoose.Types.ObjectId(contentId);

    return await this.findOneAndUpdate(
      { userId: userObjId },
      {
        $pull: { readHistory: contentObjId },
      }
    );
  };

  getAllHistory = async (userId: string) => {
    return await HistoryModel.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: 'contents',
          localField: 'readHistory',
          foreignField: '_id',
          as: 'contentDetails',
        },
      },
      {
        $unwind: '$contentDetails',
      },
      {
        $project: {
          _id: 0,
          contentId: '$contentDetails._id',
          userName: '$contentDetails.userName',
          contentType: '$contentDetails.contentType',
          title: '$contentDetails.title',
          date: '$contentDetails.date',
          squad: '$contentDetails.squad',
          isPremium: '$contentDetails.isPremium',
          thumbnailUrl: '$contentDetails.thumbnailUrl',
        },
      },
    ]);
  };
}
