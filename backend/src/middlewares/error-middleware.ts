import type { NextFunction, Request, Response } from "express";

import logger from "@/config/logger";

import CustomError from "../utils/custom-error";

function errorMiddleware(err: CustomError | Error, req: Request, res: Response, _next: NextFunction) {
  logger.error("Error:", err);

  const statusCode = err instanceof CustomError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  logger.error(statusCode.toString(), message);

  res.status(statusCode).json({ message });
}

export default errorMiddleware;
