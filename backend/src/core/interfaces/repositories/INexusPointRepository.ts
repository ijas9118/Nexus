import { IBaseRepository } from '@/core/interfaces/repositories/IBaseRepository';
import { INexusPoint } from '@/models/nexusPoint.model';

export interface INexusPointRepository extends IBaseRepository<INexusPoint> {
  getPointsByUserId(userId: string): Promise<INexusPoint[]>;
  addPointsTransaction(transaction: Partial<INexusPoint>): Promise<INexusPoint>;
}
