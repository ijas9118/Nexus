import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken, verifyRefreshToken } from '../utils/jwt.util';
import { StatusCodes } from 'http-status-codes';
import { UserRole } from '@/core/types/UserTypes';
import logger from '@/config/logger';

interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  mentorId?: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
  }
}

export const authenticate = (roles: Array<UserRole>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Access token not found' });
        return;
      }

      const decoded = verifyAccessToken(token);
      req.user = decoded;

      if (roles.length && (!req.user || !roles.includes(req.user.role))) {
        logger.debug(req.user.role, roles);
        res.status(StatusCodes.FORBIDDEN).json({ message: 'Permission denied' });
        return;
      }
      next();
    } catch (error) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Invalid or expired access token', error });
    }
  };
};

export const validateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Refresh token not found' });
      return;
    }

    const decoded = verifyRefreshToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Invalid or expired refresh token', error });
  }
};
