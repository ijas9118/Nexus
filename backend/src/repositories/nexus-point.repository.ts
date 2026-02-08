import { injectable } from "inversify";

import type { INexusPointRepository } from "@/core/interfaces/repositories/i-nexus-point-repository";
import type { INexusPoint } from "@/models/nexus-point.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { NexusPointModel } from "@/models/nexus-point.model";

@injectable()
export class NexusPointRepository
  extends BaseRepository<INexusPoint>
  implements INexusPointRepository {
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
