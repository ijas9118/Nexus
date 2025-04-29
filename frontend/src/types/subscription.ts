export interface ISubscriptionWithPlan {
  _id: string;
  userId: string;
  planId: {
    _id: string;
    tier: string;
    description: string;
    price: number;
    interval: string;
    ctaText: string;
    highlights: string[];
    logo: string;
    featured: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    durationInDays: number;
  };
  paymentId: string;
  tier: string;
  status: "active" | "canceled" | "expired";
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
