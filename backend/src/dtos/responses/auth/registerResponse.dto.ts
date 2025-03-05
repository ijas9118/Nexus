import { ObjectId } from 'mongoose';

export interface RegisterResponseDto {
  _id: ObjectId;
  name: string;
  email: string;
  username: string;
}
