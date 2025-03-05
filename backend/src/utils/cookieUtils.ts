import { Response } from 'express';
import { UserRole } from '../core/types/UserTypes';
import { generateRefreshToken } from './jwt.util';
import { NODE_ENV } from './constants';

export const setRefreshTokenCookie = (res: Response, payload: { _id: string; role: UserRole }) => {
  const refreshToken = generateRefreshToken(payload);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });
};
