import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../../models/user.model";
export interface CustomRequest extends Request {
  user?: {
    _id: IUser["_id"];
    email: string;
    name: string;
  };
}
