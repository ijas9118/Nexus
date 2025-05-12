import { injectable } from 'inversify';
import { BaseRepository } from '@/core/abstracts/base.repository';
import { INexusPoint, NexusPointModel } from '@/models/nexusPoint.model';
import { INexusPointRepository } from '@/core/interfaces/repositories/INexusPointRepository';

@injectable()
export class NexusPointRepository
  extends BaseRepository<INexusPoint>
  implements INexusPointRepository
{
  constructor() {
    super(NexusPointModel);
  }

  async getPointsByUserId(userId: string): Promise<INexusPoint[]> {
    return await NexusPointModel.find({ userId }).exec();
  }

  async addPointsTransaction(transaction: Partial<INexusPoint>): Promise<INexusPoint> {
    const newTransaction = new NexusPointModel(transaction);
    return await newTransaction.save();
  }
}
