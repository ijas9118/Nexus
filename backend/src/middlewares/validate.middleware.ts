import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z, ZodError } from 'zod';

export const validateRequest = (schema: {
  body?: z.ZodSchema;
  params?: z.ZodSchema;
  query?: z.ZodSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) schema.body.parse(req.body); // Validate body
      if (schema.params) schema.params.parse(req.params); // Validate params
      if (schema.query) schema.query.parse(req.query); // Validate query
      next();
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        res.status(StatusCodes.BAD_REQUEST).json({
          errors: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      } else {
        next(error);
      }
    }
  };
};
