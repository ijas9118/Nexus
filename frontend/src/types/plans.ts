export interface IPlan {
  _id?: string;
  name: string;
  price: number;
  description: string;
  interval: "monthly" | "yearly";
  features: string[];
  activeSubscribers?: number;
  revenue?: number;
  conversionRate?: number;
}
