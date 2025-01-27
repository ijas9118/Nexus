import { Request } from "express";

export interface CustomRequest extends Request {
  user?: {
    _id: string;
    email: string;
    name: string;
  };
}
