export interface Squad {
  _id: string;
  name: string;
  category: string;
  membersCount: number;
  isActive: boolean;
  logo: string
  description?: string
  handle?: string
}
