import { ObjectId } from "mongoose";

export interface LoginResponseDto {
  _id: ObjectId;
  name: string;
  email: string;
  accessToken?: string;
  refreshToken?: string;
}
