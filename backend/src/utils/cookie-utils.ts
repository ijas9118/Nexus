import type { Response } from 'express';

import type { UserRole } from '@/core/types/user-types';

import { env } from '../utils/env-validation';
import { generateRefreshToken } from './jwt.util';

export function setRefreshTokenCookie(res: Response, payload: { _id: string; role: UserRole }) {
  const refreshToken = generateRefreshToken(payload);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
}

export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });
}
