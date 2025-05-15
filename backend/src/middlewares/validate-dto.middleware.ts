import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import CustomError from '@/utils/CustomError';
import { StatusCodes } from 'http-status-codes';

export const validateDto = (dtoClass: { fromPayload: (payload: any) => any }) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = dtoClass.fromPayload(req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}).join(', '))
        .join(', ');
      next(new CustomError(`Invalid input: ${errorMessages}`, StatusCodes.BAD_REQUEST));
    }

    req.body = dtoInstance;
    next();
  };
};
