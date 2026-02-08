import type { IPlan } from "@/models/plan.model";

export interface IPlanService {
  createPlan: (data: Partial<IPlan>) => Promise<IPlan>;
  getAllPlans: () => Promise<IPlan[]>;
  getPlanById: (id: string) => Promise<IPlan | null>;
  updatePlan: (id: string, data: Partial<IPlan>) => Promise<IPlan | null>;
  softDeletePlan: (id: string) => Promise<IPlan | null>;
}
