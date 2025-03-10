import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/CustomError';

const errorMiddleware = (
  err: CustomError | Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  const statusCode = err instanceof CustomError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  console.log(statusCode, message);

  res.status(statusCode).json({ message });
};

export default errorMiddleware;
