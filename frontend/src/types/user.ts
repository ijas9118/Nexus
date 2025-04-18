export interface UserInterface {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: "user" | "mentor" | "admin";
  bio?: string;
  profilePic?: string;
  followers: number;
  following: number;
  connections: number;
  joinedAt: string;
  socials?: [{ platform: string; url: string }];
  isPremium: boolean;
  location: string;
  phone: string;
}
