import { IUser } from "../user";

export interface LoginResponse {
  user: IUser;
  accessToken: string;
  message: string;
}
