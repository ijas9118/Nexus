import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

const ACCESS_TOKEN_SECRET = ACCESS_TOKEN || 'access_secret';
const REFRESH_TOKEN_SECRET = REFRESH_TOKEN || 'refresh_secret';

export const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (user: object): string => {
  return jwt.sign({ user }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): any => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
