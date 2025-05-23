import { UserInterface } from "../user";

export interface LoginResponse {
  user: UserInterface;
  accessToken: string;
  message: string;
}
