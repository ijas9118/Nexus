export interface UserInterface {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: "user" | "mentor" | "admin";
  bio?: string;
  profilePicture?: string;
  followers: number;
  following: number;
  connections: number;
  joinedAt: string;
}
