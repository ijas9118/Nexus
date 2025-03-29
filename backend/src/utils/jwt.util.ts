import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import { JwtPayloadWithUser } from '../core/types/global/jwt';

const ACCESS_TOKEN_SECRET = ACCESS_TOKEN || 'access_secret';
const REFRESH_TOKEN_SECRET = REFRESH_TOKEN || 'refresh_secret';

export const generateAccessToken = (payload: JwtPayloadWithUser): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (user: object): string => {
  return jwt.sign({ user }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): JwtPayloadWithUser => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayloadWithUser;
};

export const verifyRefreshToken = (token: string): JwtPayloadWithUser => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayloadWithUser;
};
