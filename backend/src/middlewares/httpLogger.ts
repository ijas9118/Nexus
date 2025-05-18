import logger from '@/config/logger';
import { Request, Response, NextFunction } from 'express';

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const responseTime = (seconds * 1000 + nanoseconds / 1e6).toFixed(3);
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${responseTime} ms | user: ${req.user ? req.user._id : 'anonymous'}`;

    logger.http(message);
  });

  next();
};
