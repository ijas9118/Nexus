export interface IPlan {
  _id?: string;
  tier: string;
  description: string;
  price: number;
  interval: string;
  ctaText: string;
  highlights: string[];
  logo: string;
  featured: boolean;
  isActive?: boolean;
}
