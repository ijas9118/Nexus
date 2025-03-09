import { Request } from 'express';
import { JwtPayloadWithUser } from './jwt';

export interface CustomRequest extends Request {
  user?: JwtPayloadWithUser;
}
