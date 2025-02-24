export interface Squad {
  _id: string;
  name: string;
  category: string;
  members: string[];
  isActive: boolean;
  logo: string;
  description?: string;
  handle?: string;
  isJoined?: boolean;
}
