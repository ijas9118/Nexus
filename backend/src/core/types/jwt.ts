import { JwtPayload } from 'jsonwebtoken';
import { UserRole } from './UserTypes';

export interface JwtPayloadWithUser extends JwtPayload {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}
