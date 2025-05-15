import { Response } from 'express';
import { generateRefreshToken } from './jwt.util';
import { NODE_ENV } from './constants';
import { UserRole } from '@/core/types/UserTypes';

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
