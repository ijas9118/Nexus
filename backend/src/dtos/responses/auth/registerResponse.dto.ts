import { ObjectId } from "mongoose";

export interface RegisterResponseDto {
  _id: ObjectId;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}
