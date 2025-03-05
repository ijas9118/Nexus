import { Request } from 'express';
import { UserRole } from './UserTypes';

export interface CustomRequest extends Request {
  user?: {
    _id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}
