import type { IBaseRepository } from "@/core/interfaces/repositories/i-base-repository";
import type { INexusPoint } from "@/models/user/nexus-point.model";

export interface INexusPointRepository extends IBaseRepository<INexusPoint> {
  getPointsByUserId: (userId: string) => Promise<INexusPoint[]>;
  addPointsTransaction: (transaction: Partial<INexusPoint>) => Promise<INexusPoint>;
}
