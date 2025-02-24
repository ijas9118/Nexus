import { ObjectId } from "mongoose";

export interface LoginResponseDto {
  _id: ObjectId;
  name: string;
  email: string;
  role: string;
  username?: string;
  profilePic?: string;
}
